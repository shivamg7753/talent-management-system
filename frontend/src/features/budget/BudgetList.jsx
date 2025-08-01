import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
} from "@mui/material";
import { apiGet } from "../../lib/api";

export default function BudgetList() {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    apiGet("/api/budget")
      .then((data) => setBudgets(data.budgets || data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!budgets.length) return <Typography>No budgets found.</Typography>;

  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table>
        <TableHead>
                        <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Description</TableCell>
              </TableRow>
        </TableHead>
        <TableBody>
          {budgets.map((b) => (
            <TableRow key={b.id}>
              <TableCell>{b.name}</TableCell>
              <TableCell>${b.amount?.toLocaleString() || b.total?.toLocaleString() || '0'}</TableCell>
              <TableCell>{b.category || '-'}</TableCell>
              <TableCell>{b.description || '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
