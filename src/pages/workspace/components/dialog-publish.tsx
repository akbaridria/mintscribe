"use client";

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
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  Sparkles,
  TrendingUp,
  Shield,
  Zap,
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
      icon: <ImageIcon className="h-5 w-5" />,
      status: "pending",
    },
    {
      id: 2,
      title: "Upload Metadata",
      description: "Creating and uploading coin metadata...",
      icon: <FileText className="h-5 w-5" />,
      status: "pending",
    },
    {
      id: 3,
      title: "Creating Coin",
      description: "Deploying your coin to the blockchain...",
      icon: <Wallet className="h-5 w-5" />,
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
        <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full shadow-lg">
          <CheckCircle className="h-5 w-5 text-white" />
        </div>
      );
    } else if (step.status === "loading") {
      return (
        <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full shadow-lg">
          <Loader2 className="h-5 w-5 animate-spin text-white" />
        </div>
      );
    } else if (step.status === "error") {
      return (
        <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-red-500 to-rose-500 rounded-full shadow-lg">
          <AlertCircle className="h-5 w-5 text-white" />
        </div>
      );
    } else {
      return (
        <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full">
          <span className="text-sm font-semibold text-white">{index + 1}</span>
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
    <div className="">
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button
            size="sm"
            className="shrink-0 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-200"
            onClick={() => setOpen(true)}
          >
            <Send className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Publish</span>
          </Button>
        </DialogTrigger>
        <DialogContent
          className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto"
          onPointerDownOutside={(e) => isLoading && e.preventDefault()}
        >
          <DialogHeader className="space-y-4 pb-6">
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl">
                <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl">
                  <Coins className="h-6 w-6 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    Create Your Coin
                  </DialogTitle>
                  <DialogDescription className="text-gray-600">
                    {isLoading
                      ? loadingMessage
                      : transactionState.isSuccess
                      ? "Your coin has been created successfully!"
                      : "Launch your own cryptocurrency on the blockchain"}
                  </DialogDescription>
                </div>
              </div>
            </div>
          </DialogHeader>

          {/* Success State */}
          {transactionState.isSuccess && (
            <div className="space-y-6">
              <Card className="border-0 bg-gradient-to-r from-green-50 to-emerald-50">
                <CardContent className="p-8">
                  <div className="text-center space-y-6">
                    <div className="flex items-center justify-center">
                      <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full shadow-lg">
                        <CheckCircle className="h-12 w-12 text-white" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-green-700">
                        🎉 Coin Created Successfully!
                      </h3>
                      <p className="text-green-600">
                        Your coin has been deployed to the blockchain and is
                        ready to use.
                      </p>
                    </div>
                    {transactionState.txHash && (
                      <Card className="bg-white/50 border border-green-200">
                        <CardContent className="p-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Shield className="h-4 w-4 text-green-600" />
                              <span className="text-sm font-medium text-green-700">
                                Transaction Hash
                              </span>
                            </div>
                            <p className="text-xs font-mono break-all text-green-600 bg-green-50 p-2 rounded">
                              {transactionState.txHash}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </CardContent>
              </Card>
              <Button
                onClick={() => setOpen(false)}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                Close
              </Button>
            </div>
          )}

          {/* Loading State with Steps */}
          {isLoading && !transactionState.isSuccess && (
            <div className="space-y-8">
              {/* Progress Section */}
              <Card className="border-0 bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">
                        Overall Progress
                      </span>
                      <Badge
                        variant="secondary"
                        className="bg-blue-100 text-blue-700"
                      >
                        {Math.round(progress)}% Complete
                      </Badge>
                    </div>
                    <Progress value={progress} className="h-3 bg-gray-200" />
                  </div>
                </CardContent>
              </Card>

              {/* Steps */}
              <div className="space-y-6">
                {steps.map((step, index) => (
                  <Card
                    key={step.id}
                    className={`border-2 transition-all duration-300 ${
                      step.status === "completed"
                        ? "border-green-200 bg-green-50"
                        : step.status === "loading"
                        ? "border-blue-200 bg-blue-50 shadow-lg"
                        : step.status === "error"
                        ? "border-red-200 bg-red-50"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          {getStepIcon(step, index)}
                        </div>
                        <div className="flex-1 min-w-0 space-y-2">
                          <div className="flex items-center gap-3">
                            <h4
                              className={`text-lg font-semibold ${
                                step.status === "completed"
                                  ? "text-green-700"
                                  : step.status === "loading"
                                  ? "text-blue-700"
                                  : step.status === "error"
                                  ? "text-red-700"
                                  : "text-gray-600"
                              }`}
                            >
                              {step.title}
                            </h4>
                            {step.status === "loading" && (
                              <Badge
                                variant="secondary"
                                className="bg-blue-100 text-blue-700"
                              >
                                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                Processing
                              </Badge>
                            )}
                          </div>
                          <p
                            className={`text-sm ${
                              step.status === "completed"
                                ? "text-green-600"
                                : step.status === "loading"
                                ? "text-blue-600"
                                : step.status === "error"
                                ? "text-red-600"
                                : "text-gray-500"
                            }`}
                          >
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Coin Details Summary */}
              <Card className="border-0 bg-gradient-to-r from-purple-50 to-blue-50">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-purple-600" />
                      <h4 className="text-lg font-semibold text-gray-900">
                        Coin Details
                      </h4>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <span className="text-xs text-gray-500 uppercase tracking-wide">
                          Name
                        </span>
                        <p className="font-semibold text-gray-900">
                          {formData.name}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs text-gray-500 uppercase tracking-wide">
                          Symbol
                        </span>
                        <p className="font-semibold text-gray-900">
                          {formData.symbol}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs text-gray-500 uppercase tracking-wide">
                          Category
                        </span>
                        <p className="font-semibold text-gray-900">
                          {formData.category || "Coin"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs text-gray-500 uppercase tracking-wide">
                          Network
                        </span>
                        <p className="font-semibold text-gray-900">
                          Base Sepolia
                        </p>
                      </div>
                      {address && (
                        <div className="col-span-2 space-y-1">
                          <span className="text-xs text-gray-500 uppercase tracking-wide">
                            Creator
                          </span>
                          <p className="font-mono text-sm text-gray-900">
                            {`${address.slice(0, 6)}...${address.slice(-4)}`}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Form State */}
          {!isLoading && !transactionState.isSuccess && (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Error Alert */}
              {transactionState.isError && (
                <Alert
                  variant="destructive"
                  className="border-red-200 bg-red-50"
                >
                  <AlertCircle className="h-5 w-5" />
                  <div className="flex flex-col space-y-3 w-full">
                    <AlertDescription className="text-red-700">
                      {transactionState.error}
                    </AlertDescription>
                    <Button
                      variant="outline"
                      size="sm"
                      className="self-end border-red-200 text-red-700 hover:bg-red-100 bg-transparent"
                      onClick={(e) => {
                        e.preventDefault();
                        handleSubmit(e);
                      }}
                    >
                      <Loader2 className="h-3 w-3 mr-2" /> Retry
                    </Button>
                  </div>
                </Alert>
              )}

              {/* Wallet Connection Alert */}
              {!address && (
                <Alert className="border-amber-200 bg-amber-50">
                  <AlertCircle className="h-5 w-5 text-amber-600" />
                  <AlertDescription className="text-amber-700">
                    Please connect your wallet to create a coin.
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid gap-8">
                {/* Basic Information */}
                <Card className="border-0 bg-gradient-to-r from-gray-50 to-gray-100">
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="h-5 w-5 text-gray-600" />
                        <h3 className="text-lg font-semibold text-gray-900">
                          Basic Information
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label
                            htmlFor="name"
                            className="text-sm font-medium text-gray-700"
                          >
                            Coin Name
                          </Label>
                          <Input
                            id="name"
                            placeholder="e.g., Zora Protocol Coin"
                            value={formData.name}
                            onChange={(e) =>
                              handleInputChange("name", e.target.value)
                            }
                            className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="symbol"
                            className="text-sm font-medium text-gray-700"
                          >
                            Coin Symbol
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
                            className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                            required
                          />
                          <p className="text-xs text-gray-500">
                            Usually 3-5 characters (e.g., ZORA, ETH, USDC)
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="description"
                          className="text-sm font-medium text-gray-700"
                        >
                          Description
                        </Label>
                        <Textarea
                          id="description"
                          placeholder="e.g., The official coin for the Zora Protocol ecosystem, enabling governance and rewards..."
                          value={formData.description}
                          onChange={(e) =>
                            handleInputChange("description", e.target.value)
                          }
                          className="min-h-[120px] border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="category"
                          className="text-sm font-medium text-gray-700"
                        >
                          Category
                        </Label>
                        <Input
                          id="category"
                          placeholder="e.g., Governance, Utility, Gaming"
                          value={formData.category}
                          onChange={(e) =>
                            handleInputChange("category", e.target.value)
                          }
                          className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                          required
                        />
                        <p className="text-xs text-gray-500">
                          Specify the category of your coin (e.g., Governance,
                          Utility, Gaming)
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Visual & Financial */}
                <Card className="border-0 bg-gradient-to-r from-blue-50 to-indigo-50">
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Zap className="h-5 w-5 text-blue-600" />
                        <h3 className="text-lg font-semibold text-gray-900">
                          Visual & Financial
                        </h3>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="image"
                          className="text-sm font-medium text-gray-700"
                        >
                          Coin Image
                        </Label>
                        <div className="flex items-center gap-6">
                          <div className="flex-1">
                            <Input
                              id="image"
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              className="cursor-pointer border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              required
                            />
                          </div>
                          <div className="flex items-center justify-center w-20 h-20 border-2 border-dashed border-gray-300 rounded-xl bg-white">
                            {formData.image ? (
                              <img
                                src={
                                  URL.createObjectURL(formData.image) ||
                                  "/placeholder.svg"
                                }
                                alt="Coin preview"
                                className="w-full h-full object-cover rounded-xl"
                              />
                            ) : (
                              <Upload className="h-8 w-8 text-gray-400" />
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-gray-500">
                          Upload a square image (PNG, JPG, or SVG recommended)
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="initialPurchaseAmount"
                          className="text-sm font-medium text-gray-700"
                        >
                          Initial Purchase Amount (ETH)
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
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          required
                        />
                        <p className="text-xs text-gray-500">
                          Amount of ETH to purchase initially when the coin is
                          created
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  className="flex-1 border-gray-300 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-200"
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
                  <Coins className="h-4 w-4 mr-2" />
                  Create Coin
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
