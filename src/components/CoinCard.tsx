type Coin = {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
};

export default function CoinCard({ coin }: { coin: Coin }) {
  const isPositive = coin.price_change_percentage_24h >= 0;

  return (
    <div className="bg-white rounded-2xl p-5 shadow flex items-center gap-4">
      <img src={coin.image} alt={coin.name} className="w-12 h-12" />
      <div className="flex-1">
        <div className="flex justify-between items-center">
          <h2 className="font-bold text-lg">{coin.name}</h2>
          <span
            className={`text-sm font-semibold ${isPositive ? "text-green-500" : "text-red-500"}`}
          >
            {isPositive ? "▲" : "▼"}{" "}
            {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
          </span>
        </div>
        <p className="text-gray-500 uppercase text-xs">{coin.symbol}</p>
        <p className="text-xl font-bold mt-1">
          ${coin.current_price.toLocaleString()}
        </p>
        <p className="text-gray-400 text-xs mt-1">
          Market cap : ${(coin.market_cap / 1_000_000_000).toFixed(2)}B
        </p>
      </div>
    </div>
  );
}
