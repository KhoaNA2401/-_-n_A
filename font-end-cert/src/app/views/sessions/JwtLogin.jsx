import { LoadingButton } from '@mui/lab';
import { Card, Grid } from '@mui/material';
import { Box, styled, useTheme } from '@mui/system';
import { Paragraph } from 'app/components/Typography';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ethers } from "ethers";
import abi from '../../utils/Certificates.json';
import { useEffect } from 'react';
// import useAuth from 'app/hooks/useAuth';

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
  const contractAddress = "0x0fDFB72cd4fF5e88603e36AC98742EE86249D266";
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
          alert("You are not a manager! Please connect to a manager account.");
          navigate('/session/signin', { replace: true });
          setLoading(false);
        }
      }
    } catch (error) {
      alert("You are not a manager!!!");
    }
  };
  useEffect(() => {
    // connectWallet();
    if (!checkManager()) {
      navigate('/session/signin');
    }
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
              {!currentAccount && (
                <FlexBox>
                  <LoadingButton
                    variant="contained"
                    color="primary"
                    loading={loading}
                    onClick={connectWallet}
                    loadingPosition="start"
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
                    loadingPosition="start"
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

// const JwtLogin1 = () => {

//   const contractAddress = "0x0fdfb72cd4ff5e88603e36ac98742ee86249d266";
//   const contractABI = abi.abi;
//   const [currentAccount, setCurrentAccount] = useState("");
//   const connectToBlockchain = async () => {
//     await window.ethereum.request({ method: "eth_requestAccounts" });
//     const provider = new ethers.providers.Web3Provider(window.ethereum);
//     const signer = provider.getSigner();
//     const contract = new ethers.Contract(contractAddress, contractABI, signer);
//     return contract;
//   };

//   const checkManager = async () => {
//     const contract = await connectToBlockchain();
//     const manager = await contract.checkManager(currentAccount);
//     console.log(manager);
//     return manager;
//   };
//   const connectWallet = async () => {
//     try {
//       const { ethereum } = window;

//       if (!ethereum) {
//         alert("Get MetaMask!");
//         return;
//       }
//       const accounts = await ethereum.request({
//         method: "eth_requestAccounts",
//       });
//       console.log("Connected", accounts[0]);
//       setCurrentAccount(accounts[0]);

//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const theme = useTheme();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);


//   const handleSubmit = async () => {
//     const manager = await checkManager();
//     setLoading(true);
//     alert('hello')
//     if (await manager) {
//       navigate('/material/autocomplete');
//     }
//     else {
//       setLoading(false);
//       alert("You are not a manager");
//     }


//   };

//   const handleClick = async () => {
//     // const manager = await checkManager();
//     // setLoading(true);
//     alert('hello')
//     // if (await manager) {
//     navigate('/material/autocomplete');
//     // }
//     // else {
//     //   setLoading(false);
//     //   alert("You are not a manager");
//     // }
//   }

//   const checkWalletAddress = async () => {
//     setLoading(false);
//     const manager = await checkManager();
//     if (await manager) {
//       alert("You are manager");
//       // return redirect("/AddManagerETH");
//     } else {
//       alert("You are not manager");

//     }
//   };



//   return (
//     <JWTRoot>
//       <Card className="card">
//         <Grid container>
//           <Grid item sm={6} xs={12}>
//             <JustifyBox p={4} height="100%" sx={{ minWidth: 320 }}>
//               <img src="/assets/images/illustrations/dreamer.svg" width="100%" alt="" />
//             </JustifyBox>
//           </Grid>

//           <Grid item sm={6} xs={12}>
//             <ContentBox>
//               {/* <Formik> */}

//               <form >


//                 <FlexBox justifyContent="space-between">
//                   <FlexBox gap={1}>


//                     <Paragraph>Remember Me</Paragraph>
//                   </FlexBox>

//                   <NavLink
//                     to="/session/forgot-password"
//                     style={{ color: theme.palette.primary.main }}
//                   >
//                     Forgot password?
//                   </NavLink>
//                 </FlexBox>

//                 <LoadingButton
//                   type="submit"
//                   color="primary"
//                   loading={loading}
//                   variant="contained"
//                   sx={{ my: 2 }}
//                   onClick={checkWalletAddress}
//                 >
//                   Login
//                 </LoadingButton>
//               </form>
//               {/* </Formik> */}
//             </ContentBox>
//           </Grid>
//         </Grid>
//       </Card>
//     </JWTRoot>
//   );
// };

export default JwtLogin;
