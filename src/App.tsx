import React, { useState, useEffect, useRef } from "react";
import * as tf from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";
import { Dog, Upload, X } from "lucide-react";
import { breedDictionary } from "./breedDictionary";
// Chinese-English dictionary for dog breeds

function App() {
	const [model, setModel] = useState<mobilenet.MobileNet | null>(null);
	const [prediction, setPrediction] = useState<{
		breed: string;
		probability: number;
	} | null>(null);
	const [imageUrl, setImageUrl] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [isProcessing, setIsProcessing] = useState(false);

	useEffect(() => {
		async function loadModel() {
			await tf.ready();
			const loadedModel = await mobilenet.load();
			setModel(loadedModel);
		}
		loadModel();
	}, []);

	const handleImageUpload = async (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const file = event.target.files?.[0];
		if (file) {
			await processImage(file);
		}
	};

	const processImage = async (file: File) => {
		if (model) {
			setIsProcessing(true);
			setPrediction(null);
			const imageUrl = URL.createObjectURL(file);
			setImageUrl(imageUrl);
			const img = new Image();
			img.src = imageUrl;
			img.onload = async () => {
				const predictions = await getPrediction(img);
				if (predictions && predictions.length > 0) {
					const topPrediction = predictions[0];
					setPrediction({
						breed: topPrediction.className,
						probability: topPrediction.probability,
					});
				}
				setIsProcessing(false);
			};
		}
	};

	const getPrediction = async (imgElement: HTMLImageElement) => {
		const tfImg = tf.browser.fromPixels(imgElement);
		const resizedImg = tf.image.resizeBilinear(tfImg, [224, 224]);
		const expandedImg = resizedImg.expandDims(0);
		const predictions = await model!.classify(
			expandedImg as unknown as HTMLImageElement
		);
		tfImg.dispose();
		resizedImg.dispose();
		expandedImg.dispose();
		return predictions;
	};

	const resetState = () => {
		setImageUrl(null);
		setPrediction(null);
	};

	console.log(prediction?.breed);

	return (
		<div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
			<h1 className="text-3xl font-bold mb-8 text-center">狗狗品種辨識</h1>
			<div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
				{model ? (
					<div className="flex justify-center">
						<button
							onClick={() => fileInputRef.current?.click()}
							className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 flex items-center justify-center"
							disabled={isProcessing}
						>
							<Upload className="mr-2" /> 上傳圖片
						</button>
						<input
							type="file"
							accept="image/*"
							onChange={handleImageUpload}
							ref={fileInputRef}
							className="hidden"
						/>
					</div>
				) : (
					<p className="text-center">正在載入模型...</p>
				)}
				{imageUrl && (
					<div className="mt-4 relative">
						<img
							src={imageUrl}
							alt="上傳的狗狗"
							className="w-full rounded-md"
						/>
						<button
							onClick={resetState}
							className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition duration-300"
						>
							<X size={20} />
						</button>
					</div>
				)}
				{isProcessing && (
					<div className="mt-4 text-center">
						<p className="font-semibold">正在處理圖片...</p>
					</div>
				)}
				{prediction && (
					<div className="mt-4 text-center">
						<p className="font-semibold">預測結果：</p>
						<p className="text-xl mt-2 flex items-center justify-center">
							<Dog className="mr-2" size={"32px"} />
							{breedDictionary[prediction.breed] || prediction.breed}（
							{prediction.breed}）
						</p>
						<p className="mt-2">
							可能性：{(prediction.probability * 100).toFixed(2)}%
						</p>
					</div>
				)}
			</div>
		</div>
	);
}

export default App;
