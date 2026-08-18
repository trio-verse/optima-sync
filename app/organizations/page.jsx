import { getMyOrganisations } from "@/actions/getMyOrgs";
import OrganisationsList from "@/components/OrganisationsList";
import WelcomeNoOrg from "@/components/WelcomeNoOrg";

export default async function OrganisationsPage() {
  const result = await getMyOrganisations();
  const organisations = result?.data || [];

  if (organisations.length === 0) {
    return <WelcomeNoOrg />;
  }

  return <OrganisationsList organisations={organisations} />;
}