import {
  Box,
  Icon,
  IconButton,
  styled,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  useTheme,
} from "@mui/material";
import { useState, useEffect } from "react";
import { db } from '../../../utils/firebase-config'
import { collection, getDocs, query, updateDoc, doc, where, onSnapshot } from "firebase/firestore";
import QRCode from "react-qr-code";
import { ethers } from "ethers";
import abi from "../../../utils/Certificates.json";
import ImageZoom from 'react-medium-image-zoom';
const StyledTable = styled(Table)(({ theme }) => ({
  whiteSpace: "pre",
  "& thead": {
    "& tr": { "& th": { paddingLeft: 0, paddingRight: 0 } },
  },
  "& tbody": {
    "& tr": { "& td": { paddingLeft: 0, textTransform: "capitalize" } },
  },
  '& small': {
    width: 50,
    height: 15,
    borderRadius: 500,
    boxShadow: '0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.24)',
  },
}));


const Small = styled('small')(({ bgcolor }) => ({
  width: 50,
  height: 15,
  color: '#fff',
  padding: '2px 8px',
  borderRadius: '4px',
  overflow: 'hidden',
  background: bgcolor,
  boxShadow: '0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.24)',
}));


const SimpleTable = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [mangers, setMangers] = useState([]);
  const [loading, setLoading] = useState(false);

  const contractAddress = "0x0fDFB72cd4fF5e88603e36AC98742EE86249D266";
  const contractABI = abi.abi;
  // const [managerAddress, setManagerAddress] = useState("");
  const [currentAccount, setCurrentAccount] = useState("");
  const [transactionETH, setTransactionETH] = useState("");
  const [findManager, setFindManager] = useState("");
  const { palette } = useTheme();
  const bgError = palette.error.main;
  const bgPrimary = palette.primary.main;

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

  //remove manager and update status in firebase to inactive then update the table
  const removeManager = async (id) => {
    //alert with option to cancel or confirm
    if (window.confirm("Are you sure you want to remove this manager?")) {
      try {
        const contract = await connectToBlockchain();
        const manager = await contract.removeManager(id);
        await manager.wait();
        setTransactionETH(manager.hash);
        const docRef = doc(db, "managers", id);
        await updateDoc(docRef, {
          status: "inactive",
          transactionETHRemove: manager.hash,
        });
        alert("Update status successfully");
        window.location.reload();
      } catch (error) {
        console.log(error);
        alert("You are not a ADMIN!!!");
      }
    }
  };


  // const getMangers = async () => {
  //   setLoading(true);
  //   setLoading(false);
  //   // const q2 = query(collection(db, "managers"), where("transactionETH", "==", "0xd3761bd1a5e159f68325b10fbe4beaee68a3e26761bd8d660d01d261d54b6c87"));
  //   // const querySnapshot2 = await getDocs(q2);
  //   // querySnapshot2.forEach((doc) => {
  //   //   console.log(doc.data());
  //   //   setFindManager(doc.data());
  //   // }
  //   // );
  // };


  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };



  useEffect(() => {
    const data = onSnapshot(collection(db, "managers"), (querySnapshot) => {
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push(doc.data());
      });
      setMangers(items);
    }
    );
  }, []);

  return (
    <Box width="100%" overflow="auto">
      <StyledTable >
        <TableHead>
          <TableRow>
            <TableCell align="left">Name</TableCell>
            <TableCell align="center">Email</TableCell>
            <TableCell align="center">Status</TableCell>
            <TableCell align="center">Wallet Address</TableCell>
            <TableCell align="center">TransactionETH</TableCell>
            <TableCell align="center">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody >
          {mangers
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((subscriber, index) => (
              <TableRow key={index} >
                <TableCell align="left">{subscriber.managerName}</TableCell>
                <TableCell align="center">{subscriber.manangerEmail}</TableCell>
                {subscriber.status === "Active" ? (
                  <TableCell align="center">
                    <Small bgcolor={bgPrimary}>{subscriber.status}</Small>
                  </TableCell>
                ) : (
                  <TableCell align="center">
                    <Small bgcolor={bgError}>{subscriber.status}</Small>
                  </TableCell>
                )}
                {/* <TableCell align="center">{subscriber.status}</TableCell> */}

                <TableCell align="center">{subscriber.managerAddress}</TableCell>
                <TableCell align="right">
                  <ImageZoom>
                    <QRCode value={'https://goerli.etherscan.io/tx/' + subscriber.transactionETH}
                       viewBox="0 0 100 100"
                       media="(max-width: 20em)"
                       style={{ display: 'block', margin: 'left 20, right 0', width: '20em' }}
                      size={100}
                    />
                  </ImageZoom>
                </TableCell>
                {subscriber.status === "Active" ? (
                  <TableCell align="center">
                    <IconButton
                      onClick={() => removeManager(subscriber.managerAddress)}
                      color="error"
                    >
                      <Icon fontSize="small">close</Icon>
                    </IconButton>
                  </TableCell>
                ) : (
                  <TableCell align="center">
                    <IconButton
                      onClick={() => removeManager(subscriber.managerAddress)}
                      color="error"
                      disabled={true}
                    >
                      <Icon fontSize="small">close</Icon>
                    </IconButton>
                  </TableCell>
                )}
              </TableRow>
            ))}
        </TableBody>
      </StyledTable>
      <TablePagination
        sx={{ px: 2 }}
        page={page}
        component="div"
        rowsPerPage={rowsPerPage}
        count={mangers.length}
        onPageChange={handleChangePage}
        rowsPerPageOptions={[5, 10, 25]}
        onRowsPerPageChange={handleChangeRowsPerPage}
        nextIconButtonProps={{ "aria-label": "Next Page" }}
        backIconButtonProps={{ "aria-label": "Previous Page" }}
      />
    </Box>
  );
};

export default SimpleTable;
