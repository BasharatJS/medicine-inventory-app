'use client';

import Badge from '@/components/shared/Badge';

interface ExpiryBadgeProps {
  daysRemaining: number;
}

export default function ExpiryBadge({ daysRemaining }: ExpiryBadgeProps) {
  if (daysRemaining < 0) {
    return <Badge variant="danger">Expired ({Math.abs(daysRemaining)}d ago)</Badge>;
  }

  if (daysRemaining === 0) {
    return <Badge variant="danger">Expires Today</Badge>;
  }

  if (daysRemaining <= 30) {
    return <Badge variant="danger">{daysRemaining} days left</Badge>;
  }

  if (daysRemaining <= 60) {
    return <Badge variant="warning">{daysRemaining} days left</Badge>;
  }

  if (daysRemaining <= 90) {
    return <Badge variant="warning">{daysRemaining} days left</Badge>;
  }

  return <Badge variant="success">{daysRemaining} days left</Badge>;
}
