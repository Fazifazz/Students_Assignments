import { Box, Card, CardContent, Stack, Typography } from '@mui/material';

/**
 * Section card used across the dashboard and feature pages.
 * Keeps padding, radius and shadow consistent in one place.
 */
export default function SectionCard({ title, subtitle, action, children, sx, contentSx }) {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', ...sx }}>
      {(title || action) && (
        <Stack
          direction="row"
          alignItems="flex-start"
          justifyContent="space-between"
          spacing={2}
          sx={{ px: 2.5, pt: 2.25, pb: 1.5 }}
        >
          <Box sx={{ minWidth: 0 }}>
            {title && (
              <Typography variant="h5" noWrap>
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          {action}
        </Stack>
      )}
      <CardContent sx={{ px: 2.5, pb: 2.5, pt: 0, flexGrow: 1, ...contentSx }}>
        {children}
      </CardContent>
    </Card>
  );
}
