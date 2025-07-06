import type React from "react";

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
import type { ICoinData } from "@/types";
import { Coins, Check, Copy } from "lucide-react";
import { useState } from "react";

interface DialogBuyCoinProps {
  coinData: ICoinData;
}

const DialogBuyCoin: React.FC<DialogBuyCoinProps> = ({ coinData }) => {
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [purchaseAmount, setPurchaseAmount] = useState("");

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(coinData?.address || "");
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    } catch (err) {
      console.error("Failed to copy address:", err);
    }
  };

  return (
    <Dialog>
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
            Support this creator
          </DialogTitle>
          <DialogDescription className="text-base text-gray-600 leading-relaxed">
            Purchase ${coinData?.symbol} tokens to show your appreciation and
            support the author's work
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                Contract Address
              </h4>
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
            <Label
              htmlFor="amount"
              className="text-sm font-semibold text-gray-900 uppercase tracking-wide"
            >
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
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  ${coinData?.symbol}
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Enter the amount of tokens you'd like to purchase
            </p>
          </div>

          <div className="pt-4">
            <Button
              disabled={
                !purchaseAmount || Number.parseFloat(purchaseAmount) <= 0
              }
              className="w-full py-3 text-base font-semibold bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 disabled:text-gray-500 transition-all duration-200 rounded-lg"
            >
              Purchase ${coinData?.symbol} Tokens
            </Button>
            <p className="text-xs text-gray-500 text-center mt-3">
              By purchasing, you support the creator.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogBuyCoin;
