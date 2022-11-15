import {
    Box,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    Zoom,
} from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import React from "react";
import { SimpleCard } from "app/components";
import QRCode from "react-qr-code";
import ImageZoom from "react-medium-image-zoom";
import 'react-medium-image-zoom/dist/styles.css'
import {
    Card,
    Fab,
    Grid,
    Icon,
    lighten,
    styled,
    useTheme,
} from "@mui/material";
import { useState, useEffect } from "react";
import { db } from "../../../utils/firebase-config"
import {
    collection,
    getDocs,
    query,
    updateDoc,
    getCountFromServer,
    doc,
    where,
    onSnapshot,
    getDoc,
} from "firebase/firestore";
export default function FormFindCert() {
    const [open, setOpen] = React.useState(false);

    function handleClickOpen() {
        setOpen(true);
    }

    function handleClose() {
        setOpen(false);
    }

    const [certificates, setCertificates] = useState([]);
    const [inputID, setInputID] = useState("");
    const items = [];
    const getCertificates = async () => {
        try {
            const q = query(
                collection(db, "certificates"),
                where("stu_id", "==", `${inputID}`)
            );
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                items.push({ ...doc.data(), id: doc.id });
                setCertificates(items);
                handleClickOpen();
                console.log(doc.id, " => ", doc.data());
                console.log(items.length);
            });
            const count = await (await getCountFromServer(q)).data().count;
            if (count === 0) {
                alert("No certificate found. Please check your ID again.");
            }
        } catch (error) {
            console.log(error);
        }
        console.log(items.length);
    };

    const IconBox = styled("div")(() => ({
        width: 16,
        height: 16,
        color: "#fff",
        display: "flex",
        overflow: "hidden",
        borderRadius: "300px ",
        justifyContent: "center",
        "& .icon": { fontSize: "14px" },
    }));

    const ContentBox = styled("div")(() => ({
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
    }));
    const FabIcon = styled(Fab)(() => ({
        width: "44px !important",
        height: "44px !important",
        boxShadow: "none !important",
    }));

    const StyledTable = styled(Table)(() => ({
        whiteSpace: "pre",
        "& thead": {
            "& tr": { "& th": { paddingLeft: 0, paddingRight: 0 } },
        },
        "& tbody": {
            "& tr": { "& td": { paddingLeft: 0, textTransform: "capitalize" } },
        },
    }));

    const canBeSubmitted = () => {
        return inputID.length > 0;
    };

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const handleChangePage = (_, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const isEnable = canBeSubmitted();

    const [detail, setDetail] = useState([]);

    const getDetail = async (transactionETH) => {
        console.log(transactionETH);
        const find = query(
            collection(db, "certificates"),
            where("transactionETH", "==", `${transactionETH}`)
        );
        const unsubscribe = onSnapshot(find, (querySnapshot) => {
            const list = [];
            querySnapshot.forEach((doc) => {
                list.push({ ...doc.data(), id: doc.id });
                console.log(doc.id, " => ", doc.data());
                handleClickOpen();
            });
            setDetail(list);
            console.log(list);
        });
        return unsubscribe;
    };
    useEffect(() => {
        console.log(inputID);
        const q = query(
            collection(db, "certificates"),
            where("stu_id", "==", `${inputID}`)
        );
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const list = [];
            querySnapshot.forEach((doc) => {
                list.push({ ...doc.data(), id: doc.id });
                console.log(doc.id, " => ", doc.data());
            });
            setCertificates(list);
            console.log(list);
        });
        return unsubscribe;
    }, [inputID]);

    return (
        <Box>
            <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Certificate ID"
                type="text"
                fullWidth
                onChange={(e) => setInputID(e.target.value)}
            />
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
                            <TableCell align="right">Details</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {certificates
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((subscriber, index) => (
                                <TableRow key={index}>
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
                                                size={100}
                                                // width="20em"
                                                viewBox="0 0 100 100"
                                                media="(max-width: 20em)"
                                                style={{ display: 'block', margin: '0 auto', width: '20em' }}
                                            />
                                        </ImageZoom>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Button
                                            color="primary"
                                            onClick={() => getDetail(`${subscriber.transactionETH}`)}
                                        >
                                            <Icon>search</Icon>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </StyledTable>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="form-dialog-title"
                >
                    <ContentBox>
                        <DialogTitle id="form-dialog-title">
                            Certificates Has Verified
                        </DialogTitle>
                        <FabIcon
                            size="medium"
                            sx={{ background: "rgba(9, 182, 109, 0.15)" }}
                        >
                            <Icon sx={{ color: "#08ad6c" }}>check</Icon>
                        </FabIcon>
                    </ContentBox>
                    {detail.map((item) => (
                        <Stack spacing={2} direction="row">
                            <SimpleCard title="Certificates Details">
                                <div>
                                    <p>Student Name: {item.name}</p>
                                    <p>Student ID: {item.stu_id}</p>
                                    <p>Email: {item.email}</p>
                                    <p>Course: {item.course}</p>
                                    <p>From Day: {item.date}</p>
                                    <p>College: {item.college}</p>
                                    <p>Term: {item.term}</p>
                                    <p>Trusted Account: {item.deloyAddress}</p>
                                    <p>Trainsaction ETH: {item.transactionETH}</p>
                                    <ImageZoom>
                                        <QRCode
                                            value={
                                                "https://goerli.etherscan.io/tx/" + item.transactionETH
                                            }
                                            size="100"
                                            // width="20em"
                                            viewBox="0 0 100 100"
                                            media="(max-width: 20em)"
                                            style={{
                                                display: "block",
                                                margin: "0 auto",
                                                width: "20em",
                                            }}
                                        /></ImageZoom>
                                </div>
                            </SimpleCard>
                        </Stack>
                    ))}
                    <DialogActions>
                        <Button variant="outlined" color="secondary" onClick={handleClose}>
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
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
}