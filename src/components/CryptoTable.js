import React, { useEffect, useState } from 'react'

export default function SortTable() {
    const [coins, setCoins] = useState([]);
    const [sortedOrder, setSortedOrder] = useState('dsc');
    const [favouriteCoins, setFavouriteCoins] = useState([]);

    // Check for duplicate coins in favourite list
    const hasCoin = (id) => {
        for (let index = 0; index < favouriteCoins.length; index++) {
            if (favouriteCoins[index].id === id) return true;
        }
        return false;
    }

    // Remove favourite
    const removeFavourite = (id) => {
        const newFavouriteCoins = [...favouriteCoins].filter((coin) => coin.id !== id);
        setFavouriteCoins([...newFavouriteCoins]);
        localStorage.setItem('favourite-coins', JSON.stringify([...newFavouriteCoins]));
    }

    // Add to favourite 
    const addToFavourite = (id) => {
        if (favouriteCoins.length < 3 && !hasCoin(id)) {
            const selectedCoin = coins.filter((coin) => id === coin.id);
            const allSelectedCoins = [...favouriteCoins, ...selectedCoin];
            setFavouriteCoins([...allSelectedCoins]);
            localStorage.setItem('favourite-coins', JSON.stringify([...allSelectedCoins]));
        }
    }

    // Sort coins
    const sortCoins = (column) => {
        if (sortedOrder === 'asc') {
            const sortedCoins = [...coins].sort((coin_x, coin_y) => coin_x[column] > coin_y[column] ? 1 : -1);
            setCoins([...sortedCoins]);
            setSortedOrder('dsc');
        } else if (sortedOrder === 'dsc') {
            const sortedCoins = [...coins].sort((coin_x, coin_y) => coin_x[column] < coin_y[column] ? 1 : -1);
            setCoins([...sortedCoins]);
            setSortedOrder('asc');
        }
    }

    // Fetch API
    const fetchData = async () => {
        const response = await fetch('https://api.coinstats.app/public/v1/coins?skip=0&limit=30');
        const data = await response.json();
        setCoins([...data.coins]);
    }

    useEffect(() => {
        fetchData();
        const storedCoins = JSON.parse(localStorage.getItem('favourite-coins'));
        if (storedCoins) setFavouriteCoins([...storedCoins]);
    }, []);
    return (
        <div className='containerr'>
            <div className='innerWrapper'>

            </div>
            <div className='contentWrapper'>
                <div className='parentfavWrapper'>

                    <p className='heading'>Click on currency name to add to Favourite</p>
                    <div className='favouriteWrapper'>
                        {
                            favouriteCoins && favouriteCoins.map((coin) => {
                                const { id, icon, name, symbol, price, priceChange1h } = coin;
                                return (
                                    <div key={id} className='favCrypto'>
                                        <div className='wrapper favWrapper'>
                                            <div className='nameImgContainer'>
                                                <img src={icon}></img>
                                                <div className='nameContainer'>
                                                    <p className='name'>{name}</p>
                                                    <p className='symbol'>{symbol}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='priceChangeWrapper'>
                                            <div className='price'>
                                                <p className='label'>Price</p>
                                                <p className='text'>${price.toFixed(2)}</p>
                                            </div>
                                            <div className='change'>
                                                <p className='label'>Change(1Hr)</p>
                                                {
                                                    priceChange1h < 0 ?
                                                        (<p className='text red'>{priceChange1h}</p>) :
                                                        (<p className='text green'>{priceChange1h}</p>)
                                                }
                                            </div>
                                        </div>
                                        <div className='removeFavourite' onClick={() => removeFavourite(id)}>
                                            <p>Remove</p>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                <table className='table border custom-table-width'>
                    <thead>
                        <tr className='header'>
                            <th className='left custom-hide' onClick={() => sortCoins("rank")}>Rank</th>
                            <th className='left' onClick={() => sortCoins("name")}>Name</th>
                            <th className='right' onClick={() => sortCoins("price")}>Price</th>
                            <th className='right custom-hide' onClick={() => sortCoins("marketCap")}>Market Cap</th>
                            <th className='right custom-hide' onClick={() => sortCoins("volume")}>Volume</th>
                            <th className='right custom-hide' onClick={() => sortCoins("totalSupply")}>Supply</th>
                            <th className='right' onClick={() => sortCoins("priceChange1h")}>Change(1Hr)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            coins.map((coin) => {
                                const { id, rank, icon, name, symbol, price, priceChange1h, marketCap, volume, totalSupply, } = coin;
                                return (
                                    <tr className='brow' key={id}>
                                        <td className='center custom-hide'>{rank}</td>
                                        <td>
                                            <div className='wrapper'>
                                                <div className='nameImgContainer'>
                                                    <img src={icon}></img>
                                                    <div className='nameContainer'>
                                                        <p title='Add to favourite' onClick={() => addToFavourite(id)} className='name'>{name}</p>
                                                        <p className='symbol'>{symbol}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className='right'>${price.toFixed(2)}</td>

                                        <td className='right custom-hide'>
                                            ${Number(marketCap) >= 1.0e9 ? (Number(marketCap) / 1.0e9).toFixed(2) + "b" :
                                                Number(marketCap) >= 1.0e6 ? (Number(marketCap) / 1.0e6).toFixed(2) + "m" :
                                                    Number(marketCap) >= 1.0e3 ? (Number(marketCap) / 1.0e3).toFixed(2) + "k" :
                                                        Number(marketCap).toFixed(2)}</td>

                                        <td className='right custom-hide'>
                                            ${Number(volume) >= 1.0e9 ? (Number(volume) / 1.0e9).toFixed(2) + "b" :
                                                Number(volume) >= 1.0e6 ? (Number(volume) / 1.0e6).toFixed(2) + "m" :
                                                    Number(volume) >= 1.0e3 ? (Number(volume) / 1.0e3).toFixed(2) + "k" :
                                                        Number(volume).toFixed(2)}
                                        </td>

                                        <td className='right custom-hide'>
                                            ${Number(totalSupply) >= 1.0e9 ? (Number(totalSupply) / 1.0e9).toFixed(2) + "b" :
                                                Number(coin.totalSupply) >= 1.0e6 ? (Number(totalSupply) / 1.0e6).toFixed(2) + "m" :
                                                    Number(totalSupply) >= 1.0e3 ? (Number(totalSupply) / 1.0e3).toFixed(2) + "k" :
                                                        Number(totalSupply).toFixed(2)}
                                        </td>
                                        {
                                            priceChange1h < 0 ?
                                                (<td className='right red'>{priceChange1h}</td>) :
                                                (<td className='right green'>{priceChange1h}</td>)
                                        }
                                    </tr>
                                )
                            })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}


