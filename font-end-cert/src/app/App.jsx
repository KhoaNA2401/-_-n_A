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
import { useNavigate } from 'react-router-dom';
const App = () => {
  const content = useRoutes(routes);
  const [currentAccount, setCurrentAccount] = useState('');
  const contractAddress = '0x37513156Fe91B86ab10Df978c83aFD61C4E24a06';
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
 
  //make alert with 2 options to confirm or cancel if confirm then redirect to login page
  useEffect(() => {
    checkManager();
    console.log(currentAccount)
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