"use client";
import React from "react";
import { useAccount } from "wagmi";
import { Address, parseEther } from "viem";
import Link from "next/link";
import {
  useCreateKernelClientEOA,
  useDisconnectKernelClient,
  useKernelClient,
  useSendTransaction,
} from "@zerodev/waas";
import Input from "app/components/Input";
import Button from "app/components/Button";
import { formatHash } from "app/helpers";

const TransactionForm = ({ isGasless }: { isGasless: boolean }) => {
  const { address, connector, chain } = useAccount();
  const [smartAddress, setSmartAddress] = React.useState("");
  const { connect } = useCreateKernelClientEOA({
    version: "v3",
  });
  const { disconnect } = useDisconnectKernelClient();
  const { isConnected, kernelClient, kernelAccount } = useKernelClient();
  const {
    write,
    isError: sendTransactionIsError,
    isPending: sendTransactionIsPending,
    isSuccess: sendTransactionIsSuccess,
    error: sendTransactionError,
    data,
  } = useSendTransaction({ paymaster: { type: "SPONSOR", gasToken: "MATIC" } });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);
    const to = formData.get("address") as Address;
    const value = formData.get("value") as string;
    const etherValue = parseEther(value);

    write([
      {
        to,
        value: etherValue,
      },
    ]);
  };

  React.useEffect(() => {
    if (!isConnected && !kernelClient && connector) {
      connect({ connector });
    }
  }, [isConnected, kernelClient, connector]);

  React.useEffect(() => {
    if (kernelClient?.account?.address) {
      setSmartAddress(kernelClient.account.address);
    } else {
      setSmartAddress("");
    }
  }, [kernelClient]);

  React.useEffect(() => {
    if (!connector && kernelClient) {
      disconnect();
    }
  }, [connector]);

  return (
    <div className="flex flex-col items-center justify-evenly">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-end gap-4 justify-center"
      >
        <Input
          label="Smart Account Address"
          name="smartAddress"
          placeholder="Please connect wallet"
          disabled
          readOnly
          value={smartAddress}
        />
        <Input
          label="Address"
          name="address"
          placeholder="0xA0Cf…251e"
          required
          disabled={!address}
        />
        <Input
          label="Value"
          name="value"
          placeholder="0.05"
          required
          disabled={!address}
        />
        {smartAddress ? (
          <Button
            isActive
            type="submit"
            className="mt-2"
            disabled={sendTransactionIsPending}
          >
            {sendTransactionIsPending ? "Waiting..." : "Send"}
          </Button>
        ) : (
          <Button className="mt-2" disabled={true}>
            Connect Wallet
          </Button>
        )}
      </form>
      <div className="w-80 min-h-40">
        {data && (
          <div className="flex justify-between">
            Transaction Hash:
            <Link
              href={`${chain?.blockExplorers?.default?.url}/tx/${data}`}
              rel="noopener noreferrer"
              target="_blank"
              className="text-indigo-500"
            >
              {formatHash(data)}
            </Link>
          </div>
        )}
        <div className="flex flex-col gap-2">
          {sendTransactionIsPending && <div>Waiting for transaction...</div>}
          {sendTransactionError && (
            <div className="text-rose-500">{`Error message: ${sendTransactionError}`}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionForm;
