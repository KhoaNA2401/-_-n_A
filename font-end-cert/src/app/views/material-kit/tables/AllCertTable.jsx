import {
  Box,
  // Icon,
  // IconButton,
  styled,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,

} from "@mui/material";
import { useState, useEffect } from "react";
import { db } from '../../../utils/firebase-config'
import { collection, getDocs, query, onSnapshot} from "firebase/firestore";
import QRCode from "react-qr-code";

import ImageZoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'
const StyledTable = styled(Table)(() => ({
  whiteSpace: "pre",
  "& thead": {
    "& tr": { "& th": { paddingLeft: 0, paddingRight: 0 } },
  },
  "& tbody": {
    "& tr": { "& td": { paddingLeft: 0, textTransform: "capitalize" } },
  },
}));




const AllCertTable = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    const data = onSnapshot(collection(db, "certificates"), (querySnapshot) => {
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push(doc.data());
      });
      setCertificates(items);
    }
    );
  }, []);
  return (
    <Box width="100%" overflow="auto">
      <StyledTable>
        <TableHead>
          <TableRow>
            <TableCell align="left">Studend ID</TableCell>
            <TableCell align="center">Full Name</TableCell>
            <TableCell align="center">Email</TableCell>
            <TableCell align="center">Course</TableCell>
            <TableCell align="center">Date</TableCell>
            <TableCell align="right">College</TableCell>
            <TableCell align="right">Term</TableCell>
            <TableCell align="right">TransactionETH</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {certificates
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((subscriber, index) => (
              <TableRow key={index} >
                <TableCell align="left">{subscriber.stu_id}</TableCell>
                <TableCell align="center">{subscriber.name}</TableCell>
                <TableCell align="center">{subscriber.email}</TableCell>
                <TableCell align="center">{subscriber.course}</TableCell>
                <TableCell align="center">{subscriber.date}</TableCell>
                <TableCell align="right">{subscriber.college}</TableCell>
                <TableCell align="right">{subscriber.term}</TableCell>
                <TableCell align="right">
                  <ImageZoom media="(max-width: 20em)" >
                    <QRCode value={'https://goerli.etherscan.io/tx/' + subscriber.transactionETH}
                      size="100"
                      // width="20em"
                      viewBox="0 0 100 100"
                      media="(max-width: 20em)"
                      style={{ display:'block' , margin: '0 auto', width: '20em'}}
                    />
                  </ImageZoom>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </StyledTable>

      <TablePagination
        sx={{ px: 2 }}
        page={page}
        component="div"
        rowsPerPage={rowsPerPage}
        count={certificates.length}
        onPageChange={handleChangePage}
        rowsPerPageOptions={[5, 10, 25]}
        onRowsPerPageChange={handleChangeRowsPerPage}
        nextIconButtonProps={{ "aria-label": "Next Page" }}
        backIconButtonProps={{ "aria-label": "Previous Page" }}
      />
    </Box>
  );
};

export default AllCertTable;
