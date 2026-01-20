"use client";

import { Wifi, WifiOff, Loader2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { ConnectionStatus as ConnectionStatusType } from "@/types/chat";

interface ConnectionStatusProps {
  status: ConnectionStatusType;
}

export const ConnectionStatus = ({ status }: ConnectionStatusProps) => {
  const statusConfig = {
    connected: {
      icon: Wifi,
      text: "Connected",
      color: "text-green-400",
      bgColor: "bg-green-400/10",
      borderColor: "border-green-400/20",
    },
    connecting: {
      icon: Loader2,
      text: "Connecting...",
      color: "text-yellow-400",
      bgColor: "bg-yellow-400/10",
      borderColor: "border-yellow-400/20",
    },
    disconnected: {
      icon: WifiOff,
      text: "Disconnected",
      color: "text-red-400",
      bgColor: "bg-red-400/10",
      borderColor: "border-red-400/20",
    },
    reconnecting: {
      icon: Loader2,
      text: "Reconnecting...",
      color: "text-orange-400",
      bgColor: "bg-orange-400/10",
      borderColor: "border-orange-400/20",
    },
    error: {
      icon: AlertCircle,
      text: "Error",
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/20",
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`
        flex items-center gap-2 px-3 py-1.5 rounded-full border
        ${config.bgColor} ${config.borderColor}
      `}
    >
      <motion.div
        animate={
          status === "connecting" || status === "reconnecting"
            ? { rotate: 360 }
            : {}
        }
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <Icon className={`w-4 h-4 ${config.color}`} />
      </motion.div>
      <span className={`text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    </motion.div>
  );
};