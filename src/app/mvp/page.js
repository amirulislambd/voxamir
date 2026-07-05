"use client";

import { useEffect, useRef, useState } from "react";

export default function MVPPage() {
  const [status, setStatus] = useState("idle");
  const [sampleRate, setSampleRate] = useState(null);
  const [lastLatentSize, setLastLatentSize] = useState(0);
  const audioCtxRef = useRef(null);
  const srcRef = useRef(null);
  const procRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    return () => {
      stopCapture();
    };
  }, []);

  function downsampleBuffer(buffer, inputRate, outputRate) {
    if (outputRate === inputRate) return buffer;
    const sampleRateRatio = inputRate / outputRate;
    const newLength = Math.round(buffer.length / sampleRateRatio);
    const result = new Float32Array(newLength);
    let offsetResult = 0;
    let offsetBuffer = 0;
    while (offsetResult < result.length) {
      const nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
      let accum = 0,
        count = 0;
      for (let i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
        accum += buffer[i];
        count++;
      }
      result[offsetResult] = count ? accum / count : 0;
      offsetResult++;
      offsetBuffer = nextOffsetBuffer;
    }
    return result;
  }

  function simulateEncode(latent) {
    // placeholder encoder: reduce to small vector by downsampling further
    const factor = 8; // crude compression factor for demo
    const length = Math.max(16, Math.floor(latent.length / factor));
    return new Float32Array(length);
  }

  async function startCapture() {
    try {
      setStatus("starting");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      audioCtxRef.current = audioCtx;
      setSampleRate(audioCtx.sampleRate);

      const src = audioCtx.createMediaStreamSource(stream);
      srcRef.current = src;

      const proc = audioCtx.createScriptProcessor(4096, 1, 1);
      procRef.current = proc;

      proc.onaudioprocess = (e) => {
        const input = e.inputBuffer.getChannelData(0);
        const down = downsampleBuffer(input, audioCtx.sampleRate, 16000);
        // simulated latent vector
        const latent = simulateEncode(down);
        setLastLatentSize(latent.length);
        // In real implementation: send `latent` over DataChannel
      };

      src.connect(proc);
      proc.connect(audioCtx.destination);

      setStatus("capturing");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }

  function stopCapture() {
    setStatus("stopping");
    try {
      if (procRef.current) {
        procRef.current.disconnect();
        procRef.current.onaudioprocess = null;
        procRef.current = null;
      }
      if (srcRef.current) {
        try { srcRef.current.disconnect(); } catch {}
        srcRef.current = null;
      }
      if (audioCtxRef.current) {
        try { audioCtxRef.current.close(); } catch {}
        audioCtxRef.current = null;
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    } finally {
      setStatus("idle");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black p-8">
      <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-lg p-6 shadow">
        <h2 className="text-2xl font-semibold mb-4">Voxamir MVP Demo</h2>
        <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-300">Simple demo: capture mic → simulate encoding → show latent size.</p>

        <div className="flex gap-2 mb-4">
          <button
            className="px-4 py-2 bg-green-600 text-white rounded"
            onClick={startCapture}
            disabled={status === "capturing"}
          >
            Start Capture
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded"
            onClick={stopCapture}
            disabled={status !== "capturing"}
          >
            Stop
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-zinc-500">Status</div>
            <div className="font-medium">{status}</div>
          </div>
          <div>
            <div className="text-xs text-zinc-500">AudioContext Sample Rate</div>
            <div className="font-medium">{sampleRate ?? "—"} Hz</div>
          </div>
          <div>
            <div className="text-xs text-zinc-500">Last latent vector length</div>
            <div className="font-medium">{lastLatentSize} elements</div>
          </div>
          <div>
            <div className="text-xs text-zinc-500">Estimated bytes (float32)</div>
            <div className="font-medium">{(lastLatentSize * 4).toLocaleString()} bytes</div>
          </div>
        </div>

        <p className="mt-4 text-xs text-zinc-500">Note: This is a prototype placeholder — real encoder/decoder logic goes in Phase 1 implementation.</p>
      </div>
    </div>
  );
}
