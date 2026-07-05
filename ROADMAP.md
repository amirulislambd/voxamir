# 🎙️ Voxamri — Ultra-Low-Bandwidth AI Voice System
### সম্পূর্ণ ডেভেলপমেন্ট রোডম্যাপ ও টাস্ক ব্রেকডাউন

> **লক্ষ্য:** মানুষের কণ্ঠস্বরকে AI দিয়ে কম্প্রেস করে (~1MB/ঘন্টা টার্গেটে) রিয়েল-টাইম, সাশ্রয়ী ভয়েস কলিং সিস্টেম তৈরি করা।
> **স্ট্যাটাস:** 🟡 Planning → Active Development

---

## 📌 প্রজেক্ট ওভারভিউ (নতুন কেউ জয়েন করলে প্রথমে এটা পড়বে)

Voxamri একটা ৪-স্তরের সিস্টেম:

```
[মাইক ইনপুট] → [AI Codec: Audio→Latent] → [WebRTC P2P Transmission] → [AI Decoder: Latent→Voice] → [স্পিকার আউটপুট]
      Phase 1              Phase 1                  Phase 2                    Phase 3              Phase 3
```

**৩টা মূল রোল দরকার:**
| রোল | দায়িত্ব | মূল ফেজ |
|---|---|---|
| 🔵 **ML/Audio Engineer** | Neural codec, voice cloning, model অপ্টিমাইজেশন | Phase 1, 3 |
| 🟢 **Backend/Network Engineer** | WebRTC, Signaling, Data channel | Phase 2 |
| 🟠 **Frontend/UX Engineer** | UI, Mobile responsiveness, state management | Phase 4 (+ সব ফেজেই সাপোর্ট) |

---

## 🎯 প্রোডাক্ট গোল ও সাকসেস ক্রাইটেরিয়া
- ১ ঘন্টা কলে প্রায় ১MB ডেটা ব্যবহার করতে হবে
- End-to-end latency <300ms টার্গেটে রাখতে হবে
- Weak network, low bandwidth, packet loss-এও call smooth রাখতে হবে
- Mobile data ও poor Wi-Fi-তে graceful degradation থাকবে
- Voice cloning/voice synthesis consent-based, privacy-first ও abuse-resistant হবে

---

## 🧭 MVP (প্রাথমিক ডেলিভারেবল)

**উদ্দেশ্য:** দ্রুত একটি চলমান প্রোটোটাইপ বানানো যার মাধ্যমে দুইজন ইউজারের মধ্যে কম-ব্যান্ডউইথে (লক্ষ্য ~1MB/ঘন্টা) রিয়েল-টাইম ভয়েস ট্রান্সমিশন সম্ভব হবে।

**বেসলাইন ফিচারসমূহ:**
- মাইক ইনপুট থেকে ব্রাউজারে latent vector জেনারেট করা (Phase 1)
- WebRTC DataChannel-এ latent packet পাঠানো ও গ্রহণ করা (Phase 2)
- রিসিভার ব্রাউজারে latent → audio ডিকোড করে প্লে করা (Phase 1+2)
- সিম্পল UI: কল শুরু/স্টপ, কানেকশন স্ট্যাটাস, ভলিউম

**সাকসেস ক্রাইটেরিয়া (Acceptance):**
- এক ঘন্টার কলে মোট ডেটা ব্যবহার ~1MB (±20%)
- End-to-end latency সাধারণ অবস্থায় <300ms
- দুইটি ব্রাউজারে P2P কল এবং সম্পূর্ণ audio loop কাজ করা (mic→encode→send→receive→decode→play)
- কম ব্যান্ডউইথে গ্রেসফুল ডিগ্রেডেশন বজায় থাকবে
- বেসিক মেট্রিকস ডকুমেন্ট করা (latency, bitrate, packet loss)

**ডেলিভারেবলস:**
- ফ্রন্টএন্ড সিম্পল ডেমো পেজ (MVP ডেমো)
- লোকাল benchmark নোট/স্ক্রিপ্ট
- MVP চালানোর জন্য README নির্দেশ



## 🗂️ ফেজ ১: ফাউন্ডেশন ও অডিও ইঞ্জিন
**সময়কাল:** সপ্তাহ ১-৩ | **রোল:** 🔵 ML Engineer + 🟠 Frontend Dev | **ডিপেন্ডেন্সি:** নেই (শুরুর পয়েন্ট)

### লক্ষ্য
RAW অডিওকে ব্রাউজারেই AI মডেল দিয়ে ছোট latent vector-এ রূপান্তর করা।

### টাস্ক ব্রেকডাউন

| # | টাস্ক | ওনার | স্ট্যাটাস | নোট |
|---|---|---|---|---|
| 1.1 | প্রজেক্ট স্ক্যাফোল্ডিং (repo, folder structure, build tool) | 🟠 | ⬜ | Vite/Next.js ঠিক করতে হবে |
| 1.2 | Web Audio API দিয়ে মাইক থেকে PCM স্ট্রিম ক্যাপচার | 🟠 | ⬜ | 16kHz sampling rate |
| 1.3 | TensorFlow.js সেটআপ + backend বেঞ্চমার্ক (WASM vs WebGL vs WebGPU) | 🔵 | ⬜ | পারফরম্যান্স ক্রিটিক্যাল |
| 1.4 | Pre-trained EnCodec/Wav2Vec মডেল ব্রাউজারে লোড ও ইনফারেন্স | 🔵 | ⬜ | মডেল সাইজ vs quality trade-off |
| 1.5 | Audio → Latent vector pipeline তৈরি | 🔵 | ⬜ | নির্ভর করে 1.2, 1.4-এর উপর |
| 1.6 | Latent vector → Audio decode (same-device টেস্ট) | 🔵 | ⬜ | নেটওয়ার্ক ছাড়া full loop |
| 1.7 | কোয়ালিটি বেঞ্চমার্ক ডকুমেন্ট (compression ratio vs audio quality) | 🔵 | ⬜ | এটা Phase 4-এর ভিত্তি |

### ✅ Definition of Done
- [ ] মাইক ইনপুট থেকে latent vector জেনারেট হচ্ছে
- [ ] latent vector থেকে আবার audio decode হয়ে শোনা যাচ্ছে (একই ব্রাউজারে)
- [ ] লেটেন্সি ও ভেক্টর সাইজ মাপা ও ডকুমেন্টেড

---

## 🗂️ ফেজ ২: রিয়েল-টাইম ট্রান্সমিশন
**সময়কাল:** সপ্তাহ ৪-৬ | **রোল:** 🟢 Backend/Network Engineer | **ডিপেন্ডেন্সি:** Phase 1 এর আউটপুট ফরম্যাট (latent vector shape) চূড়ান্ত হতে হবে

### লক্ষ্য
দুই ইউজারের মধ্যে ল্যাগ ছাড়া latent packet আদান-প্রদান।

### টাস্ক ব্রেকডাউন

| # | টাস্ক | ওনার | স্ট্যাটাস | নোট |
|---|---|---|---|---|
| 2.1 | Socket.io signaling server (Node.js) | 🟢 | ⬜ | SDP/ICE exchange |
| 2.2 | STUN/TURN সার্ভার সেটআপ (coturn) | 🟢 | ⬜ | NAT traversal-এর জন্য জরুরি |
| 2.3 | WebRTC PeerConnection স্থাপন (২ ব্রাউজার টেস্ট) | 🟢 | ⬜ | |
| 2.4 | DataChannel দিয়ে বাইনারি latent packet পাঠানো | 🟢 | ⬜ | `ordered:false, maxRetransmits:0` |
| 2.5 | Packet loss handling / jitter buffer | 🟢 | ⬜ | রিয়েল-টাইম অডিওর জন্য গুরুত্বপূর্ণ |
| 2.6 | Adaptive bitrate / quality scaling (network condition অনুযায়ী bitrate adjust) | 🟢 | ⬜ | weak network-এ smoothness maintain করতে সাহায্য করবে |
| 2.7 | Graceful fallback mode (low-bandwidth / degraded quality fallback) | 🟢 + 🔵 | ⬜ | poor connection-এ hard failure এড়াবে |
| 2.8 | Phase 1 pipeline-এর সাথে ইন্টিগ্রেশন | 🟢 + 🔵 | ⬜ | Capture→Encode→Send→Receive→Decode ফুল লুপ |
| 2.9 | কানেকশন স্টেট ম্যানেজমেন্ট (connect/disconnect/reconnect UI hooks) | 🟢 + 🟠 | ⬜ | |

### ✅ Definition of Done
- [ ] দুই ভিন্ন ব্রাউজার/ডিভাইসের মধ্যে P2P কানেকশন হচ্ছে
- [ ] Latent packet রিয়েল-টাইমে পাঠানো ও রিসিভ হচ্ছে
- [ ] End-to-end (mic → network → speaker) একটা raw pipeline কাজ করছে
- [ ] Weak network-এ graceful degradation/quality scaling কাজ করছে

---

## 🗂️ ফেজ ৩: ভয়েস ক্লোনিং ও সিন্থেসিস
**সময়কাল:** সপ্তাহ ৭-১০ | **রোল:** 🔵 ML Engineer (সবচেয়ে ভারী ফেজ, বেশি বাফার সময় রাখা হয়েছে) | **ডিপেন্ডেন্সি:** Phase 1 + Phase 2 ইন্টিগ্রেটেড থাকতে হবে

### লক্ষ্য
রিসিভার প্রান্তে ইউজারের নিজের কণ্ঠে অডিও পুনর্গঠন।

### টাস্ক ব্রেকডাউন

| # | টাস্ক | ওনার | স্ট্যাটাস | নোট |
|---|---|---|---|---|
| 3.1 | Voice sample কালেকশন ফ্লো (কয়েক মিনিটের রেকর্ডিং UI) | 🟠 + 🔵 | ⬜ | onboarding flow |
| 3.2 | Speaker embedding তৈরি (few-shot voice profile) | 🔵 | ⬜ | |
| 3.3 | VITS মডেল ব্রাউজার-কম্প্যাটিবিলিটি টেস্ট | 🔵 | ⬜ | ⚠️ রিস্ক: ভারী মডেল, fallback প্ল্যান দরকার |
| 3.4 | Fallback: lightweight vocoder (HiFi-GAN ছোট ভার্সন) রিসার্চ | 🔵 | ⬜ | VITS না চললে ব্যাকআপ |
| 3.5 | Voice profile লোকাল স্টোরেজ (প্রাইভেসি-ফার্স্ট) | 🟠 | ⬜ | |
| 3.6 | Consent/permission ফ্লো (নৈতিক সেফগার্ড) | 🟠 | ⬜ | ⚠️ misuse প্রতিরোধ জরুরি |
| 3.7 | Latent → Voice cloned audio রেন্ডারিং ইন্টিগ্রেশন | 🔵 | ⬜ | Phase 2 pipeline-এর সাথে যুক্ত |

### ✅ Definition of Done
- [ ] ইউজারের ভয়েস প্রোফাইল তৈরি হচ্ছে
- [ ] রিসিভার প্রান্তে latent vector থেকে সেন্ডারের কণ্ঠে audio শোনা যাচ্ছে
- [ ] Consent flow ছাড়া ফিচার কাজ করবে না (সেফগার্ড enforced)

---

## 🗂️ ফেজ ৪: অপ্টিমাইজেশন ও UX
**সময়কাল:** সপ্তাহ ১১-১২ | **রোল:** 🟠 Frontend + সবার সাপোর্ট | **ডিপেন্ডেন্সি:** Phase 1-3 সব ইন্টিগ্রেটেড

### টাস্ক ব্রেকডাউন

| # | টাস্ক | ওনার | স্ট্যাটাস | নোট |
|---|---|---|---|---|
| 4.1 | VAD (Voice Activity Detection) — silence suppression | 🔵 | ⬜ | চুপ থাকলে প্যাকেট বন্ধ |
| 4.2 | Compression ratio টিউনিং (~2.2 kbps টার্গেট) | 🔵 | ⬜ | 1MB/ঘন্টা লক্ষ্যে |
| 4.3 | Mobile responsive UI | 🟠 | ⬜ | |
| 4.4 | Battery/CPU usage অপ্টিমাইজেশন (মোবাইল) | 🔵 + 🟠 | ⬜ | TF.js মোবাইলে ভারী পড়তে পারে |
| 4.5 | End-to-end latency মাপা ও কমানো | সবাই | ⬜ | টার্গেট: <300ms |
| 4.6 | Error handling / reconnection UX | 🟠 | ⬜ | |
| 4.7 | ফাইনাল QA ও cross-browser টেস্ট | সবাই | ⬜ | |
| 4.8 | Quality metrics dashboard (latency, bandwidth, packet loss, CPU, audio quality) | সবাই | ⬜ | benchmark ও observability-এর জন্য |
| 4.9 | Production hardening (reconnect, retry, recovery UX, error states) | 🟠 + 🟢 | ⬜ | real-world robustness |
| 4.10 | Cross-device & cross-network stress testing (mobile data, weak WiFi, packet loss) | সবাই | ⬜ | launch-readiness |

### ✅ Definition of Done
- [ ] ১ ঘন্টা কলে ~1MB ডেটা ব্যবহার হচ্ছে
- [ ] মোবাইলে স্মুথলি চলছে
- [ ] Latency acceptable রেঞ্জে
- [ ] Poor network-এও graceful degradation ও recovery UX কাজ করছে

---

## ⚠️ ক্রস-ফেজ রিস্ক (সবার জানা দরকার)

| রিস্ক | প্রভাব | মিটিগেশন |
|---|---|---|
| ব্রাউজারে ML ইনফারেন্স স্লো হতে পারে | Phase 1, 3 | আগেই WASM/WebGPU বেঞ্চমার্ক করা |
| TURN সার্ভার bandwidth খরচ | Phase 2 | Pure P2P যতটা সম্ভব প্রাধান্য দেওয়া |
| Network instability / packet loss | Phase 2, 4 | Adaptive buffering, fallback mode, recovery mechanism তৈরি করা |
| Voice cloning misuse | Phase 3 | Consent + liveness check বাধ্যতামূলক |
| VITS মডেল ব্রাউজারে না চললে | Phase 3 | Fallback vocoder রিসার্চ আগে থেকেই রাখা (3.4) |

---

## 👥 টিম অ্যাসাইনমেন্ট টেমপ্লেট
> নতুন ডেভেলপার জয়েন করলে এখানে নাম বসিয়ে দাও

| রোল | ডেভেলপার | GitHub | ফোকাস এরিয়া |
|---|---|---|---|
| 🔵 ML/Audio | _(নাম বসাও)_ | | Phase 1, 3 |
| 🟢 Backend/Network | _(নাম বসাও)_ | | Phase 2 |
| 🟠 Frontend/UX | _(নাম বসাও)_ | | Phase 4 + সাপোর্ট |

**স্ট্যাটাস লিজেন্ড:** ⬜ শুরু হয়নি · 🟡 চলছে · ✅ সম্পন্ন · 🔴 ব্লকড

---

## 📅 পরবর্তী পদক্ষেপ (Immediate Next Steps)
1. Repo তৈরি ও প্রজেক্ট স্ক্যাফোল্ডিং (Task 1.1)
2. টিম রোল ফাইনাল করা (উপরের টেবিলে বসানো)
3. Phase 1 শুরু — Audio capture + AI compression