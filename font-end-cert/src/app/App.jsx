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
import { async } from '@firebase/util';
const App = () => {
  const content = useRoutes(routes);
  const [currentAccount, setCurrentAccount] = useState('');
  const contractAddress = '0x0fdfb72cd4ff5e88603e36ac98742ee86249d266';
  const contractABI = abi.abi;
  const navigate = useNavigate();
  
  const checkManager = async () => {
    const currentAccount = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });
    setCurrentAccount(currentAccount[0]);
    console.log(currentAccount[0]);
    //let check this account is manager or not
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    const manager = await contract.checkManager(currentAccount[0]);
    console.log(manager);
    if (manager) {
      console.log('manager');
    } else {
      window.confirm('You are not a manager', navigate('/session/signin'));
    }
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
      window.confirm("You are not a manager!",
        navigate('/session/signin'));
    }
  }
  //make alert with 2 options to confirm or cancel if confirm then redirect to login page
  useEffect(() => {
    checkManager();
  }, []);


  return (
    <MatxTheme>
      <Provider store={Store}>
        <SettingsProvider>
          <MatxTheme>{content}</MatxTheme>
        </SettingsProvider>
      </Provider>
    </MatxTheme>
  );
}

export default App;
