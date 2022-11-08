import { Stack } from "@mui/material";
import { Box, styled } from "@mui/system";
import { Breadcrumb, SimpleCard } from "app/components";
import FormVerifyCert from "./FormVerifyCert";

const Container = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "30px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
  },
}));

const AppVerifyCert = () => {
  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb routeSegments={[{ name: "Material", path: "/material" }, { name: "Verify Certificate" }]} />
      </Box>
      <Stack spacing={3}>
        <SimpleCard title="Verify Certificate">
          <FormVerifyCert />
        </SimpleCard>
      </Stack>
    </Container>
  );
};

export default AppVerifyCert;
