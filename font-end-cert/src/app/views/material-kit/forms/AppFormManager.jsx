import { Stack } from "@mui/material";
import { Box, styled } from "@mui/system";
import { Breadcrumb, SimpleCard } from "app/components";
import FormAddManager from "./FormAddManager";

const Container = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "30px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
  },
}));

const AppFormManager = () => {
  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb routeSegments={[{ name: "Material", path: "/dashboard/default" }, { name: "Add Manager" }]} />
      </Box>

      <Stack spacing={3}>
        <SimpleCard title="Form Add Manager">
          <FormAddManager />
        </SimpleCard>
      </Stack>
    </Container>
  );
};

export default AppFormManager;
