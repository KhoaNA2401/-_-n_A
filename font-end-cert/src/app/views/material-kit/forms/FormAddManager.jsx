import {
  Button,
  Grid,
  Icon,
  styled,
} from "@mui/material";
import { Span } from "app/components/Typography";
import { useState } from "react";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { ethers } from "ethers";
import abi from "../../../utils/Certificates.json";
import { db } from "../../../utils/firebase-config"
import {  setDoc, doc } from "firebase/firestore";
import { useEffect } from 'react';
import { Autocomplete } from '@mui/material';
const TextField = styled(TextValidator)(() => ({
  width: "100%",
  marginBottom: "16px",
}));

const FormAddManager = () => {
  const contractAddress = "0x0fdfb72cd4ff5e88603e36ac98742ee86249d266";
  const contractABI = abi.abi;
  const [managerAddress, setManagerAddress] = useState("");
  const [managerName, setManagerName] = useState("");
  const [manangerEmail, setManagerEmail] = useState("");
  const [status, setStatus] = useState("");
  const [currentAccount, setCurrentAccount] = useState("");
  const [confirmStatus, setConfirmStatus] = useState("");
  const [transactionETH, setTransactionETH] = useState("");
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
    console.log(manager);
    return manager;
  };

  const addManager = async () => {
    try {
      const contract = await connectToBlockchain();
      const transaction = await contract.addManager(managerAddress, managerName);
      await transaction.wait();
      console.log(transaction.hash);
      setManagerAddress("");
      setManagerName("");
      setTransactionETH(transaction.hash);
      // add manager to firebase
      const managerRef = doc(db, "managers", managerAddress);
      await setDoc(managerRef, {
        managerAddress: managerAddress,
        managerName: managerName,
        manangerEmail: manangerEmail,
        status: status,
        // transactionETH: transaction.hash,
      });
    } catch (error) {
      console.log(error);
      alert('You dont have permission!!!');
    }
      
  }

  useEffect(() => {
    ValidatorForm.addValidationRule("isMatch", (value) => {
      if (value !== status) return false;
      return true;
    });
    return () => ValidatorForm.removeValidationRule("isMatch");
  }, [status]);

  // const handleSubmit = (event) => {
  //   console.log(status);
  // };
  const option = [
    { label: 'Active' },
  ]
  return (
    <div>
      <ValidatorForm onSubmit={addManager} onError={() => null}>
        <Grid container spacing={6}>
          <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
            <TextField
              label="Manager Name"
              onChange={(e) => setManagerName(e.target.value)}
              name="name"
              value={managerName}
              validators={["required"]}
              errorMessages={["this field is required"]}
            />
            <TextField
              onChange={(e) => setManagerEmail(e.target.value)}
              type="email"
              name="email"
              label="Manager Email"
              value={manangerEmail}
              validators={["required", "isEmail"]}
              errorMessages={["this field is required", "email is not valid"]}
            />

            <TextField
              type="text"
              name="managerAddress"
              label="Wallet Address"
              value={managerAddress}
              onChange={(e) => setManagerAddress(e.target.value)}
              validators={["required"]}
              errorMessages={["this field is required"]}
            />
          </Grid>
          <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
            <Autocomplete
              options={option}

              onChange={(event, newValue) => {
                setStatus(newValue.label);
              }
              } renderInput={(params) => <TextField {...params} label="Status" />}
            />

            <TextField
              label="Confirm Status"
              onChange={(e) => setConfirmStatus(e.target.value)}
              name="status"
              value={confirmStatus}
              validators={["required", "isMatch"]}
              errorMessages={["this field is required", "din't match"]}
            />
            <TextField
              label="TransactionETH"
              onChange={(e) => setTransactionETH(e.target.value)}
              name="transactionETH"
              value={transactionETH}
              disabled={true}
            // validators={["disabled"]}
            // errorMessages={["this field is required"]}
            />
          </Grid>
        </Grid>

        <Button color="primary" variant="contained" type="submit">
          <Icon>send</Icon>
          <Span sx={{ pl: 1, textTransform: "capitalize" }}>Submit</Span>
        </Button>
      </ValidatorForm>
    </div>
  );
};
export default FormAddManager;
