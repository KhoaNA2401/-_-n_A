import { DatePicker } from '@mui/x-date-pickers'
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
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
import { collection, setDoc, doc } from "firebase/firestore";
import { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
const TextField = styled(TextValidator)(() => ({
  width: "100%",
  marginBottom: "16px",
}));

const FormAddCert = () => {
  const contractAddress = "0x0fdfb72cd4ff5e88603e36ac98742ee86249d266";
  const contractABI = abi.abi;
  const [name, setName] = useState("");
  const [stu_id, setStu_id] = useState("");
  const [email, setEmail] = useState("");
  const [course, setCourse] = useState("");
  const [date, setDate] = useState("");
  const [college, setCollege] = useState("");
  const [term, setTerm] = useState("");
  const [transactionETH, setTransactionETH] = useState("");
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
    console.log(manager);
    return manager;
  };

  const dateFormat = (date) => {
    var dateIn = date.toISOString().split('T')[0];
    var dateFormated = dateIn.split('-').reverse().join('/');
    console.log(dateFormated);
    return dateFormated;
  }

  const dateAdded = Date.now().toString();
  console.log(dateAdded);

  const addCertificateETH = async () => {
    const contract = await connectToBlockchain();
    const checkAddress = checkManager();
    // console.log(checkAddress);
    try {
      if (checkAddress) {
        const transaction = await contract.addCertificate(
          name,
          stu_id,
          email,
          course,
          dateFormat(date),
          college,
          term
        );
        console.log(date)
        await transaction.wait();
        setTransactionETH(transaction.hash);
        console.log(transaction.hash);
        const certificatesCollection = collection(db, "certificates");
        await setDoc(doc(certificatesCollection, dateAdded), {
          name: name,
          stu_id: stu_id,
          email: email,
          course: course,
          date: dateFormat(date),
          college: college,
          term: term,
          transactionETH: transaction.hash,
        });
      }
    } catch (error) {
      console.log(error);
      alert('You dont have permission!!!');
    }
  }
  useEffect(() => {

  })

  return (
    <div>
      <ValidatorForm onSubmit={addCertificateETH} onError={() => null}>
        <Grid container spacing={6}>
          <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
            <TextField
              label="Student Name"
              onChange={(e) => setName(e.target.value)}
              name="name"
              value={name}
              validators={["required"]}
              errorMessages={["this field is required"]}
            />

            <TextField
              label="Student ID"
              onChange={(e) => setStu_id(e.target.value)}
              name="stu_id"
              value={stu_id}
              validators={["required"]}
              errorMessages={["this field is required"]}
            />

            <TextField
              type="email"
              name="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              validators={["required", "isEmail"]}
              errorMessages={["this field is required", "email is not valid"]}
            />

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                value={date}
                onChange={setDate}
                renderInput={(props) => (
                  <TextField
                    {...props}
                    label="Date picker"
                    id="mui-pickers-date"
                    sx={{ mb: 2, width: "100%" }}
                  />
                )}
              />
            </LocalizationProvider>


          </Grid>

          <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
            <TextField
              label="Course"
              onChange={(e) => setCourse(e.target.value)}
              name="course"
              value={course}
              validators={["required"]}
              errorMessages={["this field is required"]}
            />
            <TextField
              label="College"
              onChange={(e) => setCollege(e.target.value)}
              name="college"
              value={college}
              validators={["required"]}
              errorMessages={["this field is required"]}
            />
            <TextField
              label="Term"
              onChange={(e) => setTerm(e.target.value)}
              name="term"
              value={term}
              validators={["required"]}
              errorMessages={["this field is required"]}
            />
            <TextField
              label="TransactionETH"
              onChange={(e) => setTransactionETH(e.target.value)}
              name="transactionETH"
              value={transactionETH}
              disabled={true}
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

export default FormAddCert;
