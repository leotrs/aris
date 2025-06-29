<script setup>
  import SecurityHero from "~/components/security/SecurityHero.vue";
  import SecurityOverview from "~/components/security/SecurityOverview.vue";
  import DataProtection from "~/components/security/DataProtection.vue";
  import ComplianceStandards from "~/components/security/ComplianceStandards.vue";
  import InfrastructureSecurity from "~/components/security/InfrastructureSecurity.vue";
  import IncidentResponse from "~/components/security/IncidentResponse.vue";
  import SecurityContact from "~/components/security/SecurityContact.vue";

  // Set page meta
  useHead({
    title: "Security & Privacy - Aris ResOps Platform",
    meta: [
      {
        name: "description",
        content:
          "Comprehensive security measures protecting your research. SOC 2, GDPR compliance, encryption, access controls, and transparent security practices for academic institutions.",
      },
      { property: "og:title", content: "Security & Privacy - Aris ResOps Platform" },
      {
        property: "og:description",
        content:
          "Comprehensive security measures protecting your research. SOC 2, GDPR compliance, encryption, access controls, and transparent security practices for academic institutions.",
      },
    ],
  });
</script>

<template>
  <div>
    <SecurityHero />
    <SecurityOverview />
    <DataProtection />
    <ComplianceStandards />
    <InfrastructureSecurity />
    <IncidentResponse />
    <SecurityContact />
  </div>
</template>

<style scoped></style>
