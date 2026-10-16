import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';
import {
  getCashPositionReport,
  getSavingsGrowthReport,
  getArrearsReport,
  normalisePeriod,
} from '@/lib/reports';

export default async function Page() {
  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: membership } = await supabase
    .from('memberships')
    .select('stokvel_id')
    .eq('profile_id', user.id)
    .limit(1)
    .maybeSingle();

  if (!membership) return <pre>No stokvel membership</pre>;

  const period = normalisePeriod(null, null);
  const [cash, savings, arrears] = await Promise.all([
    getCashPositionReport(membership.stokvel_id, period),
    getSavingsGrowthReport(membership.stokvel_id, period),
    getArrearsReport(membership.stokvel_id, period),
  ]);

  return (
    <pre style={{ padding: 24, fontSize: 12 }}>
      {JSON.stringify({ cash, savings, arrears }, null, 2)}
    </pre>
  );
}