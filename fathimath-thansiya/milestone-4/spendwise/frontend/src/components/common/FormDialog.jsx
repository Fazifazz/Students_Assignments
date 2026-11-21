import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Stack, Typography } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

/**
 * Shell for every create/edit form dialog.
 * The form body is passed as children so each feature owns its own fields.
 */
export default function FormDialog({
  open,
  title,
  subtitle,
  submitLabel = 'Save',
  cancelLabel = 'Cancel',
  loading = false,
  error,
  onSubmit,
  onClose,
  children,
  maxWidth = 'sm',
}) {
  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} fullWidth maxWidth={maxWidth}>
      <DialogTitle sx={{ pb: 1 }}>
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={2}>
          <Box>
            <Typography variant="h4">{title}</Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <IconButton onClick={onClose} aria-label="Close dialog" disabled={loading}>
            <CloseRoundedIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <Box component="form" onSubmit={onSubmit} noValidate>
        <DialogContent sx={{ pt: 2.5 }}>
          {error && (
            <Box
              sx={{
                mb: 2,
                p: 1.5,
                borderRadius: 2,
                bgcolor: 'rgba(239,68,68,0.08)',
                color: 'error.main',
                fontSize: 13,
              }}
            >
              {error}
            </Box>
          )}
          {children}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={onClose} color="inherit" disabled={loading}>
            {cancelLabel}
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Saving…' : submitLabel}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
