import { useQuery } from "@tanstack/react-query";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Treemap,
} from "recharts";
import { RechartsDevtools } from "@recharts/devtools";
import CoinCard from "./components/CoinCard";

const COINS = "bitcoin,ethereum,solana,cardano,dogecoin";
const API_URL = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${COINS}&order=market_cap_desc`;

export default function App() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["coins"],
    queryFn: () => fetch(API_URL).then((res) => res.json()),
    refetchInterval: 60_000, // intervalle de 60 secondes pour rafraîchir les données : attention à ne pas dépasser les limites de l'API de CoinGecko
  });

  if (isLoading)
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500 text-lg">Chargement...</p>
      </div>
    );

  if (isError)
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-red-500 text-lg">
          Erreur lors du chargement des données.
        </p>
      </div>
    );

  const chartData = data.map((coin: any) => ({
    name: coin.symbol.toUpperCase(),
    prix: coin.current_price,
    variation: parseFloat(coin.price_change_percentage_24h.toFixed(2)),
  }));

  const treemapData = data.map((coin: any) => ({
    name: coin.symbol.toUpperCase(),
    size: coin.market_cap,
  }));

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        🪙 Crypto Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {data.map((coin: any) => (
          <CoinCard key={coin.id} coin={coin} />
        ))}
      </div>

      <div className="bg-white rounded-2xl p-6 shadow mb-8">
        <h2 className="text-xl font-bold text-gray-700 mb-4">
          Variation 24h (%)
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="variation"
              stroke="#6366f1"
              strokeWidth={2}
              dot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow">
        <h2 className="text-xl font-bold text-gray-700 mb-4">
          Test de treemap - Market Cap
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <Treemap
            style={{
              width: "100%",
              maxWidth: "500px",
              maxHeight: "80vh",
              aspectRatio: 4 / 3,
            }}
            data={treemapData}
            dataKey="size"
            aspectRatio={4 / 3}
            stroke="#fff"
            fill="#8884d8"
          >
            <RechartsDevtools />
          </Treemap>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
