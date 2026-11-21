import { Alert, Box, Button, Skeleton, Stack, Typography } from '@mui/material';
import InboxRoundedIcon from '@mui/icons-material/InboxRounded';

export function LoadingSkeleton({ variant = 'card', height = 120, count = 1 }) {
  if (variant === 'chart') {
    return (
      <Stack spacing={1.5} sx={{ px: 1 }}>
        <Skeleton variant="rounded" height={height} sx={{ borderRadius: 2 }} />
        <Stack direction="row" spacing={1.5}>
          <Skeleton variant="rounded" height={12} width="42%" />
          <Skeleton variant="rounded" height={12} width="28%" />
        </Stack>
      </Stack>
    );
  }

  if (variant === 'row') {
    return (
      <Stack spacing={1}>
        {Array.from({ length: count }).map((_, index) => (
          <Stack key={index} direction="row" spacing={1.5} alignItems="center">
            <Skeleton variant="circular" width={36} height={36} />
            <Skeleton variant="rounded" height={14} width="38%" />
            <Skeleton variant="rounded" height={14} width="14%" sx={{ ml: 'auto !important' }} />
          </Stack>
        ))}
      </Stack>
    );
  }

  return (
    <Stack spacing={1}>
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton key={index} variant="rounded" height={height} sx={{ borderRadius: 2 }} />
      ))}
    </Stack>
  );
}

export function EmptyState({ title = 'Nothing here yet', description, action, icon: Icon = InboxRoundedIcon }) {
  return (
    <Stack alignItems="center" spacing={1.25} sx={{ py: 5, px: 2, textAlign: 'center' }}>
      <Box
        sx={{
          display: 'grid',
          placeItems: 'center',
          width: 52,
          height: 52,
          borderRadius: 999,
          bgcolor: 'rgba(16,185,129,0.10)',
          color: 'primary.main',
        }}
      >
        <Icon />
      </Box>
      <Typography variant="subtitle1">{title}</Typography>
      {description && (
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 380 }}>
          {description}
        </Typography>
      )}
      {action}
    </Stack>
  );
}

export function ErrorState({ message = 'Something went wrong.', onRetry, title = 'Unable to load data' }) {
  return (
    <Stack alignItems="center" spacing={1.5} sx={{ py: 4 }}>
      <Alert severity="error" sx={{ maxWidth: 460, textAlign: 'center' }}>
        {title}: {message}
      </Alert>
      {onRetry && (
        <Button variant="outlined" color="error" onClick={onRetry}>
          Try again
        </Button>
      )}
    </Stack>
  );
}
