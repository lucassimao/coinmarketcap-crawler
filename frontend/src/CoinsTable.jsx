

export const CoinsTable = ({coins, showPercentage})=> {

    if (!coins?.length) return null;

    return <table>
        <thead>
            <tr>
                <th>Name</th>
                <th>Symbol</th>
                <th>Marketcap</th>
                <th>Price</th>
                <th>Total Supply</th>
                <th>Max Supply</th>
                {showPercentage && <th>Percentage</th>}
            </tr>
        </thead>
        <tbody>
            {coins?.map(coin => <tr key={coin.symbol}>
                <td>{coin.name}</td>
                <td>{coin.symbol}</td>
                <td className='align-right'>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(coin.marketCap)}</td>
                <td className='align-right'>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(coin.price)}</td>
                <td className='align-right'>{new Intl.NumberFormat('en-US', { }).format(coin.totalSupply) }</td>
                <td className='align-right'>{coin.maxSupply ? new Intl.NumberFormat('en-US', { }).format(coin.maxSupply) : '-'}</td>
                {showPercentage && <td>{new Intl.NumberFormat('en-US', {maximumFractionDigits:2 }).format(coin.percentage)} %</td>}
            </tr>)}
        </tbody>
    </table>
}