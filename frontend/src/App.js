import { useEffect, useState } from 'react';
import './App.css';
import { CoinsTable } from './CoinsTable';

function App() {

  const [top5CoinsBySupplyAvailability, setTop5CoinsBySupplyAvailability] = useState(null)
  const [top5CoinsByHighestMarketDominance, setTop5CoinsByHighestMarketDominance] = useState(null)
  const [top5CoinsByMaxSupply, setTop5CoinsByMaxSupply] = useState(null)
  
  async function fetchCoinsBySupplyAvailability() {
    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/coins/bySupplyAvailability?size=5`);
    const coins = await res.json();
    setTop5CoinsBySupplyAvailability(coins);
  }

  async function fetchCoinsByHighestMarketDominance() {
    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/coins/byHighestMarketDominance?size=5`);
    const coins = await res.json();
    setTop5CoinsByHighestMarketDominance(coins);
  }

  async function fetchCoinsByMaxSupply() {
    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/coins/byMaxSupply?size=5`);
    const coins = await res.json();
    setTop5CoinsByMaxSupply(coins);
  }


  useEffect(() => {
    fetchCoinsBySupplyAvailability();
  }, []);

  useEffect(() => {
    fetchCoinsByHighestMarketDominance();
  }, []);


  useEffect(() => {
    fetchCoinsByMaxSupply();
  }, []);

  return (
    <div className="App">
      <main className="App-main">
        <h4>
          The first 5 coins by supply availability (total supply / max supply)
          <button onClick={fetchCoinsBySupplyAvailability}>refresh</button>
        </h4>
        <CoinsTable coins={top5CoinsBySupplyAvailability} />

        <h4>
          The first 5 coins with the highest market dominance (how much of the total market cap from all coins do they represent)
          <button onClick={fetchCoinsByHighestMarketDominance}>refresh</button>
        </h4>
        <CoinsTable showPercentage coins={top5CoinsByHighestMarketDominance} />

        <h4>
          The first 5 coins by max supply
          <button onClick={fetchCoinsByMaxSupply}>refresh</button>
        </h4>
        <CoinsTable coins={top5CoinsByMaxSupply} />
      </main>
    </div>
  );
}

export default App;
