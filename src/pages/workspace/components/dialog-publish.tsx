/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo } from "react";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  Upload,
  Coins,
  Loader2,
  CheckCircle,
  AlertCircle,
  ImageIcon,
  FileText,
  Wallet,
  Send,
} from "lucide-react";
import {
  createCoinCall,
  DeployCurrency,
  InitialPurchaseCurrency,
  createMetadataBuilder,
  createZoraUploaderForCreator,
  setApiKey,
} from "@zoralabs/coins-sdk";
import { parseEther, type Address } from "viem";
import { baseSepolia } from "viem/chains";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
} from "wagmi";
import { ZORA_API_KEY } from "@/config";
import { useWorkspace } from "../use-workspace";
import { calculateReadTime } from "@/lib/utils";

interface FormData {
  name: string;
  symbol: string;
  description: string;
  image: File | null;
  payoutRecipient: string;
  initialPurchaseAmount: string;
  category: string;
}

interface Step {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  status: "pending" | "loading" | "completed" | "error";
}

interface TransactionState {
  currentStep: number;
  isProcessing: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: string | null;
  txHash: string | null;
  imageUri: string | null;
  metadataUri: string | null;
}

export default function CoinCreationModal() {
  React.useEffect(() => {
    setApiKey(ZORA_API_KEY);
  }, []);

  const { updateArticle, contentArticle } = useWorkspace();
  const { address } = useAccount();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    symbol: "",
    description: "",
    image: null,
    payoutRecipient: address || "",
    initialPurchaseAmount: "0.01",
    category: "",
  });

  const [steps, setSteps] = useState<Step[]>([
    {
      id: 1,
      title: "Upload Image",
      description: "Uploading your coin image to IPFS...",
      icon: <ImageIcon className="h-4 w-4" />,
      status: "pending",
    },
    {
      id: 2,
      title: "Upload Metadata",
      description: "Creating and uploading coin metadata...",
      icon: <FileText className="h-4 w-4" />,
      status: "pending",
    },
    {
      id: 3,
      title: "Creating Coin",
      description: "Deploying your coin to the blockchain...",
      icon: <Wallet className="h-4 w-4" />,
      status: "pending",
    },
  ]);

  const [transactionState, setTransactionState] = useState<TransactionState>({
    currentStep: -1,
    isProcessing: false,
    isSuccess: false,
    isError: false,
    error: null,
    txHash: null,
    imageUri: null,
    metadataUri: null,
  });

  const [contractCallParams, setContractCallParams] = useState<any>(null);

  const parseContractError = useCallback((error: any): string => {
    if (error?.message?.includes("execution reverted")) {
      if (error.message.includes("insufficient funds")) {
        return "Your wallet doesn't have enough ETH to cover the transaction. Please add more funds and try again.";
      } else if (error.message.includes("user rejected transaction")) {
        return "You rejected the transaction in your wallet. Please try again and confirm the transaction.";
      } else if (error.message.toLowerCase().includes("nonce")) {
        return "Transaction nonce error. Please refresh the page and try again.";
      } else {
        return "The contract deployment failed. This could be due to network congestion on Base Sepolia or an issue with the Zora protocol. Please try again in a few minutes.";
      }
    }
    return error?.message || "Unknown error occurred during contract operation";
  }, []);

  const {
    writeContract,
    data: txHash,
    isPending: isWritePending,
    error: writeError,
  } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    data: dataLogs,
  } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  useEffect(() => {
    if (dataLogs) {
      console.log("Transaction receipt received:", dataLogs);
      let contractAddress = dataLogs?.logs?.[0]?.address;
      if (!contractAddress && dataLogs?.contractAddress) {
        contractAddress = dataLogs.contractAddress;
      }
      if (!contractAddress && dataLogs?.logs && dataLogs.logs.length > 0) {
        for (const log of dataLogs.logs) {
          if (log.address) {
            contractAddress = log.address;
            break;
          }
        }
      }
      if (contractAddress) {
        console.log("✅ Contract deployed at address:", contractAddress);
        const readTime = calculateReadTime(contentArticle?.content || "");
        updateArticle({
          ca: contractAddress,
          is_published: true,
          read_time: readTime,
          category: formData.category || "Coin",
          date: new Date().toISOString(),
        });
      } else {
        console.warn(
          "⚠️ Could not find contract address in transaction receipt:",
          dataLogs
        );
      }
    }
  }, [dataLogs, updateArticle, formData.category, contentArticle?.content]);

  const handleInputChange = useCallback(
    (field: keyof FormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null;
      setFormData((prev) => ({ ...prev, image: file }));
    },
    []
  );

  const updateStepStatus = useCallback(
    (stepIndex: number, status: Step["status"]) => {
      setSteps((prev) =>
        prev.map((step, index) =>
          index === stepIndex ? { ...step, status } : step
        )
      );
    },
    []
  );

  const uploadMetadataWithZora = useCallback(async () => {
    if (!formData.image || !formData.name || !formData.symbol || !address) {
      throw new Error("Missing required data for metadata upload");
    }

    try {
      updateStepStatus(0, "loading");
      setTransactionState((prev) => ({ ...prev, currentStep: 0 }));

      updateStepStatus(1, "loading");
      setTransactionState((prev) => ({ ...prev, currentStep: 1 }));

      const { createMetadataParameters } = await createMetadataBuilder()
        .withName(formData.name)
        .withSymbol(formData.symbol)
        .withDescription(formData.description)
        .withImage(formData.image)
        .withProperties({
          category: "Article",
        })
        .upload(createZoraUploaderForCreator(address as Address));

      updateStepStatus(0, "completed");
      updateStepStatus(1, "completed");

      setTransactionState((prev) => ({
        ...prev,
        metadataUri: createMetadataParameters.uri,
      }));

      return createMetadataParameters;
    } catch (error) {
      console.error("Error uploading metadata:", error);
      const currentStep = transactionState.currentStep;
      if (currentStep >= 0) {
        updateStepStatus(currentStep, "error");
      }
      throw error;
    }
  }, [formData, address, updateStepStatus, transactionState.currentStep]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!address) {
      setTransactionState((prev) => ({
        ...prev,
        isError: true,
        error: "Please connect your wallet first",
      }));
      return;
    }

    try {
      setTransactionState({
        currentStep: 0,
        isProcessing: true,
        isSuccess: false,
        isError: false,
        error: null,
        txHash: null,
        imageUri: null,
        metadataUri: null,
      });

      const metadataParameters = await uploadMetadataWithZora();

      updateStepStatus(2, "loading");
      setTransactionState((prev) => ({ ...prev, currentStep: 2 }));

      const createCoinArgs = {
        ...metadataParameters,
        payoutRecipient: (formData.payoutRecipient || address) as Address,
        owners: [address as Address],
        currency: DeployCurrency.ETH,
        chainId: baseSepolia.id,
        initialPurchase: {
          currency: InitialPurchaseCurrency.ETH,
          amount: parseEther(formData.initialPurchaseAmount),
        },
      };

      const params = await createCoinCall(createCoinArgs);
      console.log("Contract params:", params);
      setContractCallParams(params);

      try {
        writeContract(params);
      } catch (error) {
        console.error("Error calling writeContract:", error);
        updateStepStatus(2, "error");
        const errorMessage = parseContractError(error);
        setTransactionState((prev) => ({
          ...prev,
          isProcessing: false,
          isError: true,
          error: errorMessage,
        }));
        return;
      }
    } catch (error) {
      console.error("Error creating coin:", error);
      const currentStep = transactionState.currentStep;
      if (currentStep >= 0 && currentStep < steps.length) {
        updateStepStatus(currentStep, "error");
      }
      const errorMessage = parseContractError(error);
      setTransactionState((prev) => ({
        ...prev,
        isProcessing: false,
        isError: true,
        error: errorMessage,
      }));
    }
  };

  React.useEffect(() => {
    if (txHash) {
      setTransactionState((prev) => ({ ...prev, txHash }));
    }
  }, [txHash]);

  React.useEffect(() => {
    if (isConfirmed && contractCallParams) {
      updateStepStatus(2, "completed");
      setTransactionState((prev) => ({
        ...prev,
        isProcessing: false,
        isSuccess: true,
      }));
    }
  }, [isConfirmed, updateStepStatus, contractCallParams]);

  React.useEffect(() => {
    if (writeError) {
      console.error("Write contract error:", writeError);
      updateStepStatus(2, "error");
      const errorMessage = parseContractError(writeError);
      setTransactionState((prev) => ({
        ...prev,
        isProcessing: false,
        isError: true,
        error: errorMessage,
      }));
    }
  }, [writeError, updateStepStatus, parseContractError]);

  const resetForm = useCallback(() => {
    setFormData({
      name: "",
      symbol: "",
      description: "",
      image: null,
      payoutRecipient: address || "",
      initialPurchaseAmount: "0.01",
      category: "",
    });
    setTransactionState({
      currentStep: -1,
      isProcessing: false,
      isSuccess: false,
      isError: false,
      error: null,
      txHash: null,
      imageUri: null,
      metadataUri: null,
    });
    setSteps((prev) => prev.map((step) => ({ ...step, status: "pending" })));
    setContractCallParams(null);
  }, [address]);

  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      if (!newOpen && transactionState.isProcessing) {
        return;
      }
      setOpen(newOpen);
      if (!newOpen) {
        resetForm();
      }
    },
    [transactionState.isProcessing, resetForm]
  );

  const getStepIcon = (step: Step, index: number) => {
    if (step.status === "completed") {
      return (
        <div className="flex items-center justify-center w-6 h-6 bg-green-100 rounded-full">
          <CheckCircle className="h-3 w-3 text-green-600" />
        </div>
      );
    } else if (step.status === "loading") {
      return (
        <div className="flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full">
          <Loader2 className="h-3 w-3 animate-spin text-blue-600" />
        </div>
      );
    } else if (step.status === "error") {
      return (
        <div className="flex items-center justify-center w-6 h-6 bg-red-100 rounded-full">
          <AlertCircle className="h-3 w-3 text-red-600" />
        </div>
      );
    } else {
      return (
        <div className="flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full">
          <span className="text-xs font-medium text-gray-500">{index + 1}</span>
        </div>
      );
    }
  };

  const progress =
    (steps.filter((step) => step.status === "completed").length /
      steps.length) *
    100;

  const isLoading =
    transactionState.isProcessing || isWritePending || isConfirming;

  const loadingMessage = useMemo(() => {
    if (isWritePending) {
      return "Please confirm the transaction in your wallet...";
    } else if (isConfirming && txHash) {
      return "Transaction submitted! Waiting for confirmation on the blockchain...";
    } else if (transactionState.isProcessing) {
      return "Creating your coin... Please wait.";
    }
    return "Creating your coin... Please wait and confirm any wallet prompts.";
  }, [isWritePending, isConfirming, txHash, transactionState.isProcessing]);

  React.useEffect(() => {
    if (address && !formData.payoutRecipient) {
      setFormData((prev) => ({ ...prev, payoutRecipient: address }));
    }
  }, [address, formData.payoutRecipient]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" className="shrink-0" onClick={() => setOpen(true)}>
          <Send className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Publish</span>
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[520px] max-h-[90vh] overflow-y-auto p-0 gap-0"
        onPointerDownOutside={(e) => isLoading && e.preventDefault()}
      >
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <DialogTitle className="text-xl font-semibold">
                {isLoading
                  ? "Creating Coin"
                  : transactionState.isSuccess
                  ? "Coin Created"
                  : "Create Coin"}
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-500">
                {isLoading
                  ? loadingMessage
                  : transactionState.isSuccess
                  ? "Your coin has been created successfully!"
                  : "Launch your own cryptocurrency on the blockchain"}
              </DialogDescription>
            </div>
            <Coins className="h-5 w-5 text-gray-400" />
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="px-6 pb-6">
          {/* Success State */}
          {transactionState.isSuccess && (
            <div className="space-y-6">
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Success!</h3>
                  <p className="text-sm text-gray-500">
                    Your coin has been deployed to the blockchain and is ready
                    to use.
                  </p>
                </div>
                {transactionState.txHash && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-gray-700">
                        Transaction Hash
                      </p>
                      <p className="text-xs font-mono text-gray-500 break-all">
                        {transactionState.txHash}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <Button onClick={() => setOpen(false)} className="w-full">
                Close
              </Button>
            </div>
          )}

          {/* Loading State */}
          {isLoading && !transactionState.isSuccess && (
            <div className="space-y-6">
              {/* Progress */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-xs text-gray-500">
                    {Math.round(progress)}% complete
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              {/* Steps */}
              <div className="space-y-4">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-center gap-3">
                    {getStepIcon(step, index)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{step.title}</p>
                      <p className="text-xs text-gray-500">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coin Summary */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="space-y-3">
                  <p className="text-sm font-medium">Coin Details</p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-gray-500">Name</p>
                      <p className="font-medium">{formData.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Symbol</p>
                      <p className="font-medium">{formData.symbol}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Category</p>
                      <p className="font-medium">{formData.category}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Network</p>
                      <p className="font-medium">Base Sepolia</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Form State */}
          {!isLoading && !transactionState.isSuccess && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Alert - Fixed width issue */}
              {transactionState.isError && (
                <Alert variant="destructive" className="w-full">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <AlertDescription className="text-sm whitespace-normal break-all overflow-auto max-h-24">
                    {transactionState.error}
                    </AlertDescription>
                </Alert>
              )}

              {/* Wallet Connection Alert */}
              {!address && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    Please connect your wallet to create a coin.
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-5">
                {/* Basic Info */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm">
                        Name
                      </Label>
                      <Input
                        id="name"
                        placeholder="e.g., Zora Coin"
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="symbol" className="text-sm">
                        Symbol
                      </Label>
                      <Input
                        id="symbol"
                        placeholder="e.g., ZORA"
                        value={formData.symbol}
                        onChange={(e) =>
                          handleInputChange(
                            "symbol",
                            e.target.value.toUpperCase()
                          )
                        }
                        maxLength={10}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your coin's purpose and utility..."
                      value={formData.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      className="min-h-[80px] resize-none"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-sm">
                      Category
                    </Label>
                    <Input
                      id="category"
                      placeholder="e.g., Governance, Utility, Gaming"
                      value={formData.category}
                      onChange={(e) =>
                        handleInputChange("category", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>

                {/* Image & Purchase */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="image" className="text-sm">
                      Coin Image
                    </Label>
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <Input
                          id="image"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="cursor-pointer"
                          required
                        />
                      </div>
                      <div className="w-12 h-12 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                        {formData.image ? (
                          <img
                            src={URL.createObjectURL(formData.image)}
                            alt="Preview"
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <Upload className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="initialPurchaseAmount" className="text-sm">
                      Initial Purchase (ETH)
                    </Label>
                    <Input
                      id="initialPurchaseAmount"
                      type="number"
                      step="0.000000001"
                      min="0"
                      placeholder="0.01"
                      value={formData.initialPurchaseAmount}
                      onChange={(e) =>
                        handleInputChange(
                          "initialPurchaseAmount",
                          e.target.value
                        )
                      }
                      required
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={
                      !address ||
                      !formData.name ||
                      !formData.symbol ||
                      !formData.initialPurchaseAmount ||
                      Number.parseFloat(formData.initialPurchaseAmount) <= 0 ||
                      !formData.image ||
                      !formData.category
                    }
                  >
                    Create Coin
                  </Button>
                </div>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
