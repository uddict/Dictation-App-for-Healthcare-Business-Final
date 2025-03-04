import React, { useEffect, useState } from "react";
import { generatePDF } from "../services/PDFGenerator";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  TextField,
  Button,
  Box,
  Container,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import DownloadIcon from "@mui/icons-material/Download";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#3f51b5", // indigo
    },
    secondary: {
      main: "#7986cb", // light indigo
    },
    background: {
      default: "#e8eaf6", // very light indigo
    },
  },
});

const Soap = () => {
  const navigate = useNavigate();
  const data = location.state || {};

  useEffect(() => {
    if (!data || Object.keys(data).length === 0) {
      navigate("/");
      return null;
    }
  });

  const [soapData, setSoapData] = useState(data);

  const handleChange = (key, value, parentKey = null) => {
    setSoapData((prevData) => {
      const newData = { ...prevData };

      if (parentKey) {
        newData[parentKey] = { ...newData[parentKey], [key]: value };
      } else {
        newData[key] = value;
      }

      return newData;
    });
  };

  const isObjectEmpty = (obj) => {
    return (
      obj &&
      typeof obj === "object" &&
      !Array.isArray(obj) &&
      Object.values(obj).every(
        (value) => value === null || value === undefined || value === ""
      )
    );
  };

  const renderField = (key, value, depth = 0, parentKey = null) => {
    if (value === null || value === undefined || value === "") return null; // Prevent rendering empty fields

    const labelText = key
      .replace(/_/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());

    if (typeof value === "object" && !Array.isArray(value)) {
      if (isObjectEmpty(value)) return null; // Skip rendering empty sections

      return (
        <Card key={key} variant="outlined" sx={{ mt: 2, ml: depth * 2 }}>
          <CardHeader
            title={
              <Typography variant="h6" color="primary">
                {labelText}
              </Typography>
            }
          />
          <CardContent>
            {Object.entries(value).map(([subKey, subValue]) =>
              renderField(subKey, subValue, depth + 1, key)
            )}
          </CardContent>
        </Card>
      );
    } else {
      return (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" color="primary" gutterBottom>
            Label Text:
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            value={value || ""}
            multiline
            rows={value?.length > 100 ? 4 : 2}
          />
        </Box>
      );
    }
  };

  const handleDownload = async () => {
    await generatePDF(soapData, "SOAP Notes");
  };

  return (
    <ThemeProvider theme={theme}>
      <Container
        maxWidth="md"
        sx={{ py: 4, bgcolor: "background.default", minHeight: "100vh" }}
      >
        <Card elevation={3}>
          <CardHeader
            title={
              <Typography
                variant="h4"
                align="center"
                color="#ffffff"
                gutterBottom
              >
                SOAP Notes
              </Typography>
            }
            sx={{ bgcolor: "primary.light", color: "primary.contrastText" }}
          />
          <CardContent>
            {Object.entries(soapData).map(([key, value]) =>
              renderField(key, value)
            )}
          </CardContent>
        </Card>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4, gap: 2 }}>
          <Button variant="contained" color="primary" startIcon={<SaveIcon />}>
            Save
          </Button>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<DownloadIcon />}
            onClick={handleDownload}
          >
            Download
          </Button>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Soap;
