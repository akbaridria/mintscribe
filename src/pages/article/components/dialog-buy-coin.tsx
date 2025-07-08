import type React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { ICoinData } from "@/types"
import { Coins, Check, Copy, Loader2, ExternalLink } from "lucide-react"
import { useEffect, useState } from "react"
import { ZORA_API_KEY } from "@/config"
import { setApiKey, tradeCoin } from "@zoralabs/coins-sdk"
import { parseEther } from "viem"
import { useAccount, usePublicClient, useWalletClient } from "wagmi"
import { toast } from "sonner"

interface DialogBuyCoinProps {
  coinData: ICoinData
}

const DialogBuyCoin: React.FC<DialogBuyCoinProps> = ({ coinData }) => {
  const [copiedAddress, setCopiedAddress] = useState(false)
  const [copiedTxHash, setCopiedTxHash] = useState(false)
  const [purchaseAmount, setPurchaseAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [transactionHash, setTransactionHash] = useState<string | null>(null)
  const [purchaseSuccess, setPurchaseSuccess] = useState(false)

  const { address } = useAccount()
  const publicClient = usePublicClient()
  const { data: walletClient } = useWalletClient()

  useEffect(() => {
    setApiKey(ZORA_API_KEY)
  }, [])

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(coinData?.address || "")
      setCopiedAddress(true)
      setTimeout(() => setCopiedAddress(false), 2000)
    } catch (err) {
      console.error("Failed to copy address:", err)
    }
  }

  const handleCopyTxHash = async () => {
    if (!transactionHash) return

    try {
      await navigator.clipboard.writeText(transactionHash)
      setCopiedTxHash(true)
      setTimeout(() => setCopiedTxHash(false), 2000)
    } catch (err) {
      console.error("Failed to copy transaction hash:", err)
    }
  }

  const handlePurchase = async () => {
    if (!walletClient || !address || !coinData.address || !publicClient) {
      toast.error("Wallet connection required")
      return
    }

    try {
      setIsLoading(true)
      const amountToBuy = parseEther(purchaseAmount)

      const tradeParameters = {
        sell: { type: "eth" as const },
        buy: {
          type: "erc20" as const,
          address: coinData.address as `0x${string}`,
        },
        amountIn: amountToBuy,
        slippage: 0.05,
        sender: address,
      }

      const toastId = toast.loading(`Purchasing ${coinData.symbol} tokens...`)

      const transactionReceipt = await tradeCoin({
        tradeParameters,
        walletClient,
        account: walletClient.account,
        publicClient,
      })

      // Extract transaction hash from receipt
      const txHash = transactionReceipt.transactionHash
      setTransactionHash(txHash)
      setPurchaseSuccess(true)

      toast.dismiss(toastId)
      toast.success(
        <div className="flex flex-col gap-2">
          <div>Successfully purchased {coinData.symbol} tokens!</div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted-foreground">Tx:</span>
            <code className="bg-muted px-1 py-0.5 rounded text-xs">
              {txHash.slice(0, 10)}...{txHash.slice(-8)}
            </code>
            <button onClick={() => handleCopyTxHash()} className="text-muted-foreground hover:text-foreground">
              <Copy className="h-3 w-3" />
            </button>
          </div>
        </div>,
        { duration: 8000 },
      )

      setPurchaseAmount("")
    } catch (error) {
      console.error("Purchase error:", error)
      toast.dismiss()
      toast.error("Failed to purchase tokens")
    } finally {
      setIsLoading(false)
    }
  }

  const resetDialog = () => {
    setPurchaseSuccess(false)
    setTransactionHash(null)
    setPurchaseAmount("")
  }

  return (
    <Dialog onOpenChange={(open) => !open && resetDialog()}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="bg-gray-900 hover:bg-gray-800 text-white border-0 shadow-sm hover:shadow-md transition-all duration-200 font-medium"
        >
          <Coins className="h-4 w-4 mr-2" />
          Buy ${coinData?.symbol || "Coins"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg border-0 shadow-2xl">
        <DialogHeader className="text-center pb-6">
          <DialogTitle className="text-2xl font-bold text-gray-900 mb-2">
            {purchaseSuccess ? "Purchase Successful!" : "Support this creator"}
          </DialogTitle>
          <DialogDescription className="text-base text-gray-600 leading-relaxed">
            {purchaseSuccess
              ? `You have successfully purchased ${coinData?.symbol} tokens!`
              : `Purchase ${coinData?.symbol} tokens to show your appreciation and support the author's work`}
          </DialogDescription>
        </DialogHeader>

        {purchaseSuccess && transactionHash ? (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Check className="h-5 w-5 text-green-600" />
                <span className="font-semibold text-green-800">Transaction Confirmed</span>
              </div>
              <p className="text-sm text-green-700 mb-3">
                Your purchase has been successfully processed on the blockchain.
              </p>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Transaction Hash</h4>
                  <div className="flex gap-2">
                    <button
                      onClick={handleCopyTxHash}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                        copiedTxHash
                          ? "bg-green-100 text-green-700 border border-green-200"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                      }`}
                    >
                      {copiedTxHash ? (
                        <>
                          <Check className="h-3 w-3" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          Copy
                        </>
                      )}
                    </button>
                    <a
                      href={`https://basescan.org/tx/${transactionHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-200 transition-all duration-200"
                    >
                      <ExternalLink className="h-3 w-3" />
                      View
                    </a>
                  </div>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <code className="text-sm font-mono text-gray-800 break-all leading-relaxed">{transactionHash}</code>
                </div>
              </div>
            </div>

            <Button
              onClick={resetDialog}
              className="w-full py-3 text-base font-semibold bg-gray-900 hover:bg-gray-800 transition-all duration-200 rounded-lg"
            >
              Make Another Purchase
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Contract Address</h4>
                <button
                  onClick={handleCopyAddress}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                    copiedAddress
                      ? "bg-green-100 text-green-700 border border-green-200"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                  }`}
                >
                  {copiedAddress ? (
                    <>
                      <Check className="h-3 w-3" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      Copy
                    </>
                  )}
                </button>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <code className="text-sm font-mono text-gray-800 break-all leading-relaxed">
                  {coinData?.address || "No address available"}
                </code>
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="amount" className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                Purchase Amount
              </Label>
              <div className="relative">
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={purchaseAmount}
                  onChange={(e) => setPurchaseAmount(e.target.value)}
                  min="1"
                  step="0.01"
                  className="text-lg font-medium pr-20 py-3 border-gray-300 focus:border-gray-400 focus:ring-0 rounded-lg"
                />
                <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded">ETH</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Enter the amount of tokens you'd like to purchase</p>
            </div>

            <div className="pt-4">
              <Button
                onClick={handlePurchase}
                disabled={!purchaseAmount || Number.parseFloat(purchaseAmount) <= 0 || isLoading}
                className="w-full py-3 text-base font-semibold bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 disabled:text-gray-500 transition-all duration-200 rounded-lg"
              >
                {isLoading ? <Loader2 className="animate-spin h-5 w-5 mr-3" /> : `Purchase ${coinData?.symbol} Tokens`}
              </Button>
              <p className="text-xs text-gray-500 text-center mt-3">By purchasing, you support the creator.</p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default DialogBuyCoin
