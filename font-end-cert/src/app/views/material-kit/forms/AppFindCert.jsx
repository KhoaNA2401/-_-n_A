import { Stack } from "@mui/material";
import { Box, styled } from "@mui/system";
import { Breadcrumb, SimpleCard } from "app/components";

import FormFindCert from './FormFindCert';
const Container = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "30px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
  },
}));

const AppFindCert = () => {
  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb routeSegments={[{ name: "Material", path: "/material" }, { name: "Find Certificates" }]} />
      </Box>
    
      <Stack spacing={3}>
        <SimpleCard title="Find The Certificate">
          <FormFindCert />
        </SimpleCard>


      </Stack>
    </Container>
  );
};

export default AppFindCert;
