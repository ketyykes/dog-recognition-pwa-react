import React, { useState, useEffect, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import { Dog, Upload, X } from 'lucide-react';

// Chinese-English dictionary for dog breeds
const breedDictionary: { [key: string]: string } = {
"Chihuahua": "吉娃娃",
  "Japanese spaniel": "日本獅子狗",
  "Maltese dog": "馬爾濟斯犬",
  "Pekinese": "北京犬",
  "Shih-Tzu": "西施犬",
  "Blenheim spaniel": "布萊恩海姆獵犬",
  "papillon": "蝴蝶犬",
  "toy terrier": "玩具梗",
  "Rhodesian ridgeback": "羅得西亞脊背犬",
  "Afghan hound": "阿富汗獵犬",
  "basset": "巴吉度獵犬",
  "beagle": "米格魯",
  "bloodhound": "尋血獵犬",
  "bluetick": "藍斑獵犬",
  "black-and-tan coonhound": "黑褐獵浣熊犬",
  "Walker hound": "沃克獵犬",
  "English foxhound": "英國獵狐犬",
  "redbone": "紅骨獵犬",
  "borzoi": "俄羅斯獵狼犬",
  "Irish wolfhound": "愛爾蘭獵狼犬",
  "Italian greyhound": "義大利灰狗",
  "whippet": "惠比特犬",
  "Ibizan hound": "伊比沙獵犬",
  "Norwegian elkhound": "挪威獵麋犬",
  "otterhound": "水獺獵犬",
  "Saluki": "沙魯基犬",
  "Scottish deerhound": "蘇格蘭獵鹿犬",
  "Weimaraner": "威瑪犬",
  "Staffordshire bullterrier": "斯塔福郡牛頭梗",
  "American Staffordshire terrier": "美國斯塔福郡梗",
  "Bedlington terrier": "貝德靈頓梗",
  "Border terrier": "邊境梗",
  "Kerry blue terrier": "凱利藍梗",
  "Irish terrier": "愛爾蘭梗",
  "Norfolk terrier": "諾福克梗",
  "Norwich terrier": "諾里奇梗",
  "Yorkshire terrier": "約克夏梗",
  "wire-haired fox terrier": "硬毛獵狐梗",
  "Lakeland terrier": "湖畔梗",
  "Sealyham terrier": "西利漢梗",
  "Airedale": "艾爾谷梗",
  "cairn": "凱恩梗",
  "Australian terrier": "澳洲梗",
  "Dandie Dinmont": "丹第丁蒙梗",
  "Boston bull": "波士頓梗",
  "miniature schnauzer": "迷你雪納瑞",
  "giant schnauzer": "巨型雪納瑞",
  "standard schnauzer": "標準雪納瑞",
  "Scotch terrier": "蘇格蘭梗",
  "Tibetan terrier": "西藏梗",
  "silky terrier": "絲毛梗",
  "soft-coated wheaten terrier": "愛爾蘭軟毛梗",
  "West Highland white terrier": "西高地白梗",
  "Lhasa": "拉薩犬",
  "flat-coated retriever": "平毛尋回犬",
  "curly-coated retriever": "捲毛尋回犬",
  "golden retriever": "黃金獵犬",
  "Labrador retriever": "拉布拉多尋回犬",
  "Chesapeake Bay retriever": "切薩皮克灣尋回犬",
  "German short-haired pointer": "德國短毛指示犬",
  "vizsla": "維茲拉犬",
  "English setter": "英國雪達犬",
  "Irish setter": "愛爾蘭雪達犬",
  "Gordon setter": "戈登雪達犬",
  "Brittany spaniel": "布列塔尼獵犬",
  "clumber": "克倫伯獵犬",
  "English springer": "英國史賓格犬",
  "Welsh springer spaniel": "威爾斯史賓格犬",
  "cocker spaniel": "可卡獵犬",
  "Sussex spaniel": "薩塞克斯獵犬",
  "Irish water spaniel": "愛爾蘭水獵犬",
  "kuvasz": "庫瓦茲犬",
  "schipperke": "斯基帕克犬",
  "groenendael": "比利時牧羊犬",
  "malinois": "馬利諾斯犬",
  "briard": "伯瑞犬",
  "kelpie": "澳洲牧羊犬",
  "komondor": "匈牙利牧羊犬",
  "Old English sheepdog": "古代英國牧羊犬",
  "Shetland sheepdog": "設得蘭牧羊犬",
  "collie": "柯利牧羊犬",
  "Border collie": "邊境牧羊犬",
  "Bouvier des Flandres": "法蘭德斯牧牛犬",
  "Rottweiler": "羅威納犬",
  "German shepherd": "德國牧羊犬",
  "Doberman": "杜賓犬",
  "miniature pinscher": "迷你杜賓",
  "Greater Swiss Mountain dog": "大瑞士山地犬",
  "Bernese mountain dog": "伯恩山犬",
  "Appenzeller": "阿彭策爾山犬",
  "EntleBucher": "恩特雷布赫山犬",
  "boxer": "拳師犬",
  "bull mastiff": "鬥牛獒犬",
  "Tibetan mastiff": "西藏獒犬",
  "French bulldog": "法國鬥牛犬",
  "Great Dane": "大丹犬",
  "Saint Bernard": "聖伯納犬",
  "Eskimo dog": "愛斯基摩犬",
  "malamute": "阿拉斯加雪橇犬",
  "Siberian husky": "西伯利亞哈士奇",
  "dalmatian": "達爾馬提亞犬",
  "affenpinscher": "猴犬",
  "basenji": "巴辛吉犬",
  "pug": "巴哥犬",
  "Leonberg": "萊昂貝格犬",
  "Newfoundland": "紐芬蘭犬",
  "Great Pyrenees": "大白熊犬",
  "Samoyed": "薩摩耶犬",
  "Pomeranian": "博美犬",
  "chow": "鬆獅犬",
  "keeshond": "荷蘭毛獅犬",
  "Brabancon griffon": "布魯塞爾格里芬犬",
  "Pembroke": "威爾斯柯基犬",
  "Cardigan": "卡迪根威爾斯柯基犬",
  "toy poodle": "玩具貴賓犬",
  "miniature poodle": "迷你貴賓犬",
  "standard poodle": "標準貴賓犬",
  "Mexican hairless": "墨西哥無毛犬",
  "timber wolf": "灰狼",
  "white wolf": "北極狼",
  "red wolf": "紅狼",
  "coyote": "郊狼",
  "dingo": "澳洲野犬",
  "dhole": "豺",
  "African hunting dog": "非洲野犬",
  "hyena": "鬣狗",
  "red fox": "赤狐",
  "kit fox": "沙狐",
  "Arctic fox": "北極狐",
  "grey fox": "灰狐",
  "Akita": "秋田犬",
  "Australian cattle dog": "澳洲牧牛犬",
  "Australian shepherd": "澳洲牧羊犬",
  "Bichon frise": "比熊犬"
};

function App() {
  const [model, setModel] = useState<mobilenet.MobileNet | null>(null);
  const [prediction, setPrediction] = useState<{ breed: string; probability: number } | null>(null);
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

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
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
            probability: topPrediction.probability
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
    const predictions = await model!.classify(expandedImg);
    tfImg.dispose();
    resizedImg.dispose();
    expandedImg.dispose();
    return predictions;
  };

  const resetState = () => {
    setImageUrl(null);
    setPrediction(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">狗狗品種辨識</h1>
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        {model ? (
          <div className="flex justify-center mb-4">
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
            <img src={imageUrl} alt="上傳的狗狗" className="w-full rounded-md" />
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
              <Dog className="mr-2" /> 
              {breedDictionary[prediction.breed] || prediction.breed}
              （{prediction.breed}）
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