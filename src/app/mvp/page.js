"use client";

import { useEffect, useRef, useState } from "react";

export default function MVPPage() {
  const [status, setStatus] = useState("idle");
  const [sampleRate, setSampleRate] = useState(null);
  const [lastLatentSize, setLastLatentSize] = useState(0);
  const [receivedSize, setReceivedSize] = useState(0);
  const [sentCount, setSentCount] = useState(0);
  const [receivedCount, setReceivedCount] = useState(0);
  const [connectionState, setConnectionState] = useState("disconnected");
  const [dataChannelState, setDataChannelState] = useState("closed");

  const audioCtxRef = useRef(null);
  const srcRef = useRef(null);
  const procRef = useRef(null);
  const streamRef = useRef(null);
  const pcARef = useRef(null);
  const pcBRef = useRef(null);
  const dataChannelARef = useRef(null);

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
      let accum = 0;
      let count = 0;
      for (
        let i = offsetBuffer;
        i < nextOffsetBuffer && i < buffer.length;
        i++
      ) {
        accum += buffer[i];
        count += 1;
      }
      result[offsetResult] = count ? accum / count : 0;
      offsetResult += 1;
      offsetBuffer = nextOffsetBuffer;
    }
    return result;
  }

  function simulateEncode(buffer) {
    const factor = 8;
    const length = Math.max(16, Math.floor(buffer.length / factor));
    return new Uint8Array(length).fill(1);
  }

  function createPeerConnectionPair() {
    const pcA = new RTCPeerConnection();
    const pcB = new RTCPeerConnection();

    pcA.onconnectionstatechange = () => {
      setConnectionState(pcA.connectionState);
    };
    pcB.onconnectionstatechange = () => {
      setConnectionState(pcB.connectionState);
    };

    pcB.ondatachannel = (event) => {
      const channel = event.channel;
      channel.onopen = () => setDataChannelState(channel.readyState);
      channel.onclose = () => setDataChannelState(channel.readyState);
      channel.onmessage = (ev) => {
        if (ev.data instanceof ArrayBuffer) {
          const bytes = ev.data.byteLength;
          setReceivedSize(bytes);
          setReceivedCount((count) => count + 1);
        }
      };
    };

    const dataChannelA = pcA.createDataChannel("latent");
    dataChannelA.onopen = () => setDataChannelState(dataChannelA.readyState);
    dataChannelA.onclose = () => setDataChannelState(dataChannelA.readyState);
    dataChannelA.onerror = () => setDataChannelState(dataChannelA.readyState);
    dataChannelARef.current = dataChannelA;

    return { pcA, pcB };
  }

  async function connectPeers() {
    const { pcA, pcB } = createPeerConnectionPair();
    pcARef.current = pcA;
    pcBRef.current = pcB;

    const offer = await pcA.createOffer();
    await pcA.setLocalDescription(offer);
    await pcB.setRemoteDescription(offer);

    const answer = await pcB.createAnswer();
    await pcB.setLocalDescription(answer);
    await pcA.setRemoteDescription(answer);
  }

  async function startCapture() {
    try {
      setStatus("starting");
      await connectPeers();

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
        const latent = simulateEncode(down);
        setLastLatentSize(latent.length);

        if (dataChannelARef.current?.readyState === "open") {
          dataChannelARef.current.send(latent.buffer);
          setSentCount((count) => count + 1);
        }
      };

      src.connect(proc);
      proc.connect(audioCtx.destination);
      setStatus("capturing");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }

  function cleanupConnection() {
    if (dataChannelARef.current) {
      try {
        dataChannelARef.current.close();
      } catch {}
      dataChannelARef.current = null;
    }
    if (pcARef.current) {
      try {
        pcARef.current.close();
      } catch {}
      pcARef.current = null;
    }
    if (pcBRef.current) {
      try {
        pcBRef.current.close();
      } catch {}
      pcBRef.current = null;
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
        try {
          srcRef.current.disconnect();
        } catch {}
        srcRef.current = null;
      }
      if (audioCtxRef.current) {
        try {
          audioCtxRef.current.close();
        } catch {}
        audioCtxRef.current = null;
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      cleanupConnection();
    } finally {
      setStatus("idle");
      setConnectionState("disconnected");
      setDataChannelState("closed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-6 text-slate-100">
      <div className="w-full max-w-4xl rounded-4xl border border-white/10 bg-slate-900/90 p-4 sm:p-6 shadow-2xl shadow-slate-950/40 backdrop-blur-xl">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.9fr]">
          <div className="space-y-6 rounded-4xl bg-slate-950/80 p-5 sm:p-6 shadow-inner shadow-slate-950/30">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
                <div className="relative h-20 w-20 overflow-hidden rounded-full border-4 border-cyan-500/20 bg-linear-to-br from-cyan-500/20 to-slate-700 sm:h-24 sm:w-24">
                  <div className="absolute inset-0 flex items-center justify-center text-3xl font-semibold text-white/90 sm:text-4xl">
                    V
                  </div>
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
                    Calling
                  </p>
                  <h1 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">
                    Voxamir Beta
                  </h1>
                  <p className="mt-2 max-w-xl text-slate-400">
                    Realtime voice call over an AI latent stream.
                  </p>
                </div>
              </div>
              <div className="rounded-3xl bg-slate-950/80 px-4 py-3 text-sm text-slate-300 ring-1 ring-white/10">
                {status === "capturing" ? "On Air" : "Ready"}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-slate-700/60 bg-slate-950/70 p-4 text-center">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Status
                </p>
                <p className="mt-3 text-lg font-semibold text-white">
                  {status}
                </p>
              </div>
              <div className="rounded-3xl border border-slate-700/60 bg-slate-950/70 p-4 text-center">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Connection
                </p>
                <p className="mt-3 text-lg font-semibold text-white">
                  {connectionState}
                </p>
              </div>
              <div className="rounded-3xl border border-slate-700/60 bg-slate-950/70 p-4 text-center">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  DataChannel
                </p>
                <p className="mt-3 text-lg font-semibold text-white">
                  {dataChannelState}
                </p>
              </div>
            </div>

            <div className="rounded-4xl border border-slate-700/60 bg-slate-900/90 p-5">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
                Call controls
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-4">
                <button
                  className="inline-flex aspect-square h-16 min-w-16 items-center justify-center rounded-3xl bg-slate-800 text-slate-100 transition hover:bg-slate-700"
                  type="button"
                >
                  🔇
                </button>
                <button
                  className="inline-flex aspect-square h-16 min-w-16 items-center justify-center rounded-3xl bg-slate-800 text-slate-100 transition hover:bg-slate-700"
                  type="button"
                >
                  🔊
                </button>
                <button
                  className="inline-flex aspect-square h-16 min-w-16 items-center justify-center rounded-3xl bg-slate-800 text-slate-100 transition hover:bg-slate-700"
                  type="button"
                >
                  🎥
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                className="flex-1 rounded-3xl bg-cyan-500 px-5 py-4 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
                onClick={startCapture}
                disabled={status === "capturing"}
              >
                Start Call
              </button>
              <button
                className="flex-1 rounded-3xl bg-rose-500 px-5 py-4 text-sm font-semibold text-white transition hover:bg-rose-400 disabled:cursor-not-allowed disabled:opacity-50"
                onClick={stopCapture}
                disabled={status !== "capturing"}
              >
                End Call
              </button>
            </div>
          </div>

          <div className="space-y-6 rounded-4xl bg-slate-950/80 p-6 shadow-inner shadow-slate-950/30">
            <div className="rounded-3xl border border-slate-700/60 bg-slate-900/90 p-5">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
                Live metrics
              </p>
              <div className="mt-4 space-y-4 text-sm text-slate-300">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <span>Latent length</span>
                  <span className="font-semibold text-white">
                    {lastLatentSize} elems
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <span>Latent sent</span>
                  <span className="font-semibold text-white">{sentCount}</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <span>Latent received</span>
                  <span className="font-semibold text-white">
                    {receivedCount}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Received bytes</span>
                  <span className="font-semibold text-white">
                    {receivedSize}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-700/60 bg-slate-900/90 p-5">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
                Latest note
              </p>
              <p className="mt-3 text-slate-300 text-sm leading-6">
                This screen is a call-style interface for the MVP. The
                underlying demo still uses a local peer connection to verify
                DataChannel transport and audio capture.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
