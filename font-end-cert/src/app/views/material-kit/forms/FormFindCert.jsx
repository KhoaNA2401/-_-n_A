import { Box, Stack } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import React from 'react';
import { SimpleCard } from "app/components";
import QRCode from "react-qr-code";
import ImageZoom from 'react-medium-image-zoom'
import { Card, Fab, Grid, Icon, lighten, styled, useTheme } from '@mui/material';
import { useState, useEffect } from "react";
import { db } from '../../../utils/firebase-config'
import { collection, getDocs, query, updateDoc, getCountFromServer, doc, where, onSnapshot } from "firebase/firestore";
export default function FormFindCert() {
    const [open, setOpen] = React.useState(false);
    const [openResult, setOpenResult] = React.useState(false);

    function handleClickOpen() {
        setOpen(true);
    }

    function handleClose() {
        setOpen(false);
    }

    const [certificates, setCertificates] = useState([]);
    const [inputID, setInputID] = useState("");

    // find certificate with query and open dialog showing result
    const getCertificates = async () => {
        console.log(inputID);
        try {
            const q = query(collection(db, "certificates"), where("stu_id", "==", `${inputID}`));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                setCertificates(doc.data());
                handleClickOpen();
            });
            const count = await (await getCountFromServer(q)).data().count;
            if (count === 0) {
                alert("No certificate found. Please check your ID again.");
            }
        } catch (error) {
            console.log(error);
        }

    }

    const IconBox = styled('div')(() => ({
        width: 16,
        height: 16,
        color: '#fff',
        display: 'flex',
        overflow: 'hidden',
        borderRadius: '300px ',
        justifyContent: 'center',
        '& .icon': { fontSize: '14px' },
    }));

    const ContentBox = styled('div')(() => ({
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
    }));
    const FabIcon = styled(Fab)(() => ({
        width: '44px !important',
        height: '44px !important',
        boxShadow: 'none !important',
    }));

    const canBeSubmitted = () => {
        return inputID.length > 0;
    };

    const isEnable = canBeSubmitted();

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
            <Button disabled={!isEnable} variant="outlined" color="primary" onClick={getCertificates}>
                Find Certificate
            </Button>

            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <ContentBox>
                    <DialogTitle id="form-dialog-title">Certificates Has Verified</DialogTitle>
                    <FabIcon size="medium" sx={{ background: 'rgba(9, 182, 109, 0.15)' }}>
                        <Icon sx={{ color: '#08ad6c' }}>check</Icon>
                    </FabIcon>
                </ContentBox>


                <Stack spacing={2} direction="row">
                    <SimpleCard title='Certificates Details'>
                        <div>
                            <p>Student Name: {certificates.name}</p>
                            <p>Student ID: {certificates.stu_id}</p>
                            <p>Email: {certificates.email}</p>
                            <p>Course: {certificates.course}</p>
                            <p>From Day: {certificates.date}</p>
                            <p>College: {certificates.college}</p>
                            <p>Term: {certificates.term}</p>
                            <p>Trainsaction ETH: {certificates.transactionETH}</p>
                            <QRCode value={'https://goerli.etherscan.io/tx/' + certificates.transactionETH}
                                size="100"
                                // width="20em"
                                viewBox="0 0 100 100"
                                media="(max-width: 20em)"
                                style={{ display: 'block', margin: '0 auto', width: '20em' }}
                            />
                        </div>
                    </SimpleCard>
                </Stack>
                <DialogActions>
                    <Button variant="outlined" color="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
