import { LoadingButton } from '@mui/lab';
import { Card, Grid } from '@mui/material';
import { Box, styled, useTheme } from '@mui/system';
import { Paragraph } from 'app/components/Typography';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ethers } from "ethers";
import abi from '../../utils/Certificates.json';
import { useEffect } from 'react';

const FlexBox = styled(Box)(() => ({ display: 'flex', alignItems: 'center' }));

const JustifyBox = styled(FlexBox)(() => ({ justifyContent: 'center' }));

const ContentBox = styled(Box)(() => ({
  height: '100%',
  padding: '32px',
  position: 'relative',
  background: 'rgba(0, 0, 0, 0.01)',
}));

const JWTRoot = styled(JustifyBox)(() => ({
  background: '#1A2038',
  minHeight: '100% !important',
  '& .card': {
    maxWidth: 800,
    minHeight: 400,
    margin: '1rem',
    display: 'flex',
    borderRadius: 12,
    alignItems: 'center',
  },
}));

const JwtLogin = () => {
  const contractAddress = "0x37513156Fe91B86ab10Df978c83aFD61C4E24a06";
  const contractABI = abi.abi;
  const [currentAccount, setCurrentAccount] = useState("");

  const connectToBlockchain = async () => {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    return contract;
  };

  const checkManager = async () => {
    const contract = await connectToBlockchain();
    const manager = await contract.checkManager(currentAccount);
    // console.log(manager);
    setIsFalse(manager);
    return manager;
  };

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

  // const theme = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  // const { login } = useAuth();

  const handleSubmit = async () => {
    try {
      if (currentAccount == null) {
        connectWallet();
      } else {
        setLoading(true);
        const manager = await checkManager();
        console.log(manager);
        if (manager) {
          navigate('/dashboard/default', { replace: true });
        } else {
          window.confirm("You are not a manager! Please connect to a manager account."
          
          ,window.location.reload());
          setLoading(false);
        }
      }
    } catch (error) {
    }
  };
  const [isFalse, setIsFalse] = useState('');

  useEffect(() => {
    // connectWallet();
    // console.log(isFalse);
    // if (!checkManager()) {
    //   navigate('/session/signin');
    // }
  }, []);

  return (
    <JWTRoot>
      <Card className="card">
        <Grid container>
          <Grid item sm={6} xs={12}>
            <JustifyBox p={4} height="100%" sx={{ minWidth: 320 }}>
              <img src="/assets/images/illustrations/dreamer.svg" width="100%" alt="" />
            </JustifyBox>
          </Grid>
          <Grid item sm={6} xs={12} >
            <Grid item xs={12}>

              <FlexBox>
                <Paragraph sx={{ m: 0 }} style={{marginLeft: "20px", fontWeight:'bold', fontSize:'2em'}}>Login</Paragraph>
              </FlexBox>
            </Grid>
            <Grid item xs={12}>
              <FlexBox>
                <Paragraph sx={{ m: 0 }} style={{marginLeft: "20px"}}>Please login to continue</Paragraph>
              </FlexBox>
            </Grid>
            <Grid item xs={12} style={{marginLeft: "20px"}}>
              {(!currentAccount) && (
                <FlexBox>
                  <LoadingButton
                    variant="contained"
                    color="primary"
                    loading={loading}
                    onClick={connectWallet}
                    sx={{ my: 2 }}
                  >
                    Connect Wallet
                  </LoadingButton>
                </FlexBox>
              )}
              {currentAccount && (
                <FlexBox>
                  <LoadingButton
                    variant="contained"
                    color="primary"
                    loading={loading}
                    onClick={handleSubmit}
                    sx={{ my: 2 }}
                  >
                    Login
                  </LoadingButton>
                </FlexBox>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Card>
    </JWTRoot>
  );
}
export default JwtLogin;
