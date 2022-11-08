// import '../fake-db';
import { Provider } from 'react-redux';
import { useRoutes } from 'react-router-dom';
import { MatxTheme } from './components';
import { SettingsProvider } from './contexts/SettingsContext';
import { Store } from './redux/Store';
import routes from './routes';
import { ethers } from 'ethers';
import abi from './utils/Certificates.json';
import { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
const App = () => {
  const content = useRoutes(routes);
  const [currentAccount, setCurrentAccount] = useState('');
  const contractAddress = '0x0fdfb72cd4ff5e88603e36ac98742ee86249d266';
  const contractABI = abi.abi;
  const navigate = useNavigate();
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };
  const checkManager = async () => {
    const contract = await connectToBlockchain();
    const manager = await contract.checkManager(currentAccount);
    console.log(manager);
    return manager;
  };
  const connectToBlockchain = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    return contract;
  };
  const controller = async () => {
    const manager = await checkManager(currentAccount);
    if (manager) {
      console.log('You are a manager!');
    }
    else {
      alert("You are not a manager!!!");
      navigate('/session/signin');
    }
  }
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    console.log(currentAccount);
    async function check() {
    await connectWallet();
    const manager = await checkManager(currentAccount);
    if (!manager) {
      console.log('You are a manager!');
      setLoading(false);
    } else {
      navigate('/session/signin');
      connectWallet();
    }};
    check();

  }, []);
  if (isLoading) {
    return (
      <MatxTheme>
        <Provider store={Store}>
          <SettingsProvider>
            <MatxTheme>{content}</MatxTheme>
          </SettingsProvider>
        </Provider>
      </MatxTheme>
    );
  } else {
    return (
      <Navigate to="/session/signin" />
    );
  }
}

export default App;
