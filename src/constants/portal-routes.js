const routes = {
  dashboard: 'dashboard',
  userProfile: 'userProfile',
  settings: 'settings',

  devops: 'devops',
  extensions: 'extensions',
  extensionDevops: {
    name: 'devops.services.details',
    requires: 'id',
  },
  extensionSettings: {
    name: 'settings.extensions',
    requires: 'id',
  },

  subscriptions: 'subscriptions',
  subscriptionDetails: {
    name: 'subscriptions.directory.details',
    requires: 'id',
  },
  fulfillmentRequests: {
    name: 'subscriptions',
    tab: 'fulfillment',
  },
  fulfillmentRequestDetails: {
    name: 'subscriptions.fulfillment.details',
    requires: 'id',
  },
  subscriptionsBillingRequests: {
    name: 'subscriptions',
    tab: 'billing',
  },
  subscriptionsBillingRequestDetails: {
    name: 'subscriptions.billing.details',
    requires: 'id',
  },
  tierConfigs: 'tierConfigs',
  tierConfigDetails: {
    name: 'tierConfigs.directory.details',
    requires: 'id',
  },
  tierConfigRequests: {
    name: 'tierConfigs',
    tab: 'requests',
  },
  tierConfigRequestDetails: {
    name: 'tierConfigs.requests.details',
    requires: 'id',
  },
  products: 'products',
  productDetails: {
    name: 'product',
    requires: 'id',
  },
  productItems: {
    name: 'product.items',
    requires: 'id',
  },
  productParameters: {
    name: 'product.parameters',
    requires: 'id',
  },
  productSettings: {
    name: 'product.settings',
    requires: 'id',
  },
  productEmbedding: {
    name: 'product.embedding',
    requires: 'id',
  },
  productVersions: {
    name: 'product.versions',
    requires: 'id',
  },
  productLocalization: {
    name: 'product.localization',
    requires: 'id',
  },
  productSSO: {
    name: 'product.ssoServices',
    requires: 'id',
  },

  catalog: 'catalog',

  customers: 'customers',
  customerDetails: {
    name: 'customers.directory.details',
    requires: 'id',
  },
  customerRequests: {
    name: 'customers',
    tab: 'requests',
  },
  customerRequestsDetails: {
    name: 'customers.requests.details',
    requires: 'id',
  },

  pricing: 'pricings',
  pricingDetails: {
    name: 'pricings.lists.details',
    requires: 'id',
  },

  offers: 'offers',
  offerDetails: {
    name: 'offers.details',
    requires: 'id',
  },

  helpdesk: 'helpdesk',
  helpdeskCaseDetails: {
    name: 'helpdesk.cases.details',
    requires: 'id',
  },

  news: 'news',

  pim: 'pim',
  pimAttributes: 'pim.attributes',
  pimAttributeDetails: {
    name: 'pim.attributes.details',
    requires: 'id',
  },
  pimGroups: 'pim.groups',
  pimGroupDetails: {
    name: 'pim.groups.details',
    requires: 'id',
  },
  pimClassDetails: {
    name: 'pim.classes.details',
    requires: 'id',
  },
  pimCategoryDetails: {
    name: 'pim.categories.details',
    requires: 'id',
  },
  pimVariants: 'pim.variants',
  pimVariantDetails: {
    name: 'pim.variants.details',
    requires: 'id',
  },

  marketplaces: 'marketplaces',
  marketplaceDetails: {
    name: 'marketplaces.details',
    requires: 'id',
  },
  hubs: 'hubs',
  hubDetails: {
    name: 'hubs.details',
    requires: 'id',
  },

  localizationContexts: {
    name: 'localization',
    tab: 'contexts',
  },
  localizationTranslations: {
    name: 'localization',
    tab: 'translations',
  },
  localizationTranslationDetails: {
    name: 'localization.translations.details',
    requires: 'id',
  },
  localizationLocales: {
    name: 'localization',
    tab: 'locales',
  },

  usage: 'usages',
  usageDetails: {
    name: 'usages.details',
    requires: 'id',
  },

  listings: 'listings',
  listingsRequests: {
    name: 'listings',
    tab: 'requests',
  },
  listingDetails: {
    name: 'listings.directory.details',
    requires: 'id',
  },
  listingsRequestDetails: {
    name: 'listings.requests.details',
    requires: 'id',
  },

  integrations: 'integrations',
  integrationsWebhooks: 'integrations.webhooks',
  integrationsTokens: 'integrations.tokens',
  integrationsExtensions: 'integrations.extensions',

  reports: 'reports',
  reportsSchedules: {
    name: 'reports',
    tab: 'schedules',
  },
  reportDetails: {
    name: 'reports.details',
    requires: 'id',
  },
  reportsRequestDetails: {
    name: 'reports.requests.details',
    requires: 'id',
  },

  billingStreams: 'commerce.billing.streams',
  billingStreamDetails: {
    name: 'commerce.billing.streams.details',
    requires: 'id',
  },
  billingBatches: 'commerce.billing.batches',
  billingBatchDetails: {
    name: 'commerce.billing.batches.details',
    requires: 'id',
  },
  billingRequests: 'commerce.billing.requests',
  billingRequestDetails: {
    name: 'commerce.billing.requests.details',
    requires: 'id',
  },

  pricingStreams: 'commerce.pricing.streams',
  pricingStreamDetails: {
    name: 'commerce.pricing.streams.details',
    requires: 'id',
  },
  pricingBatches: 'commerce.pricing.batches',
  pricingBatchDetails: {
    name: 'commerce.pricing.batches.details',
    requires: 'id',
  },
  pricingRequests: 'commerce.pricing.requests',
  pricingRequestDetails: {
    name: 'commerce.pricing.requests.details',
    requires: 'id',
  },

  partners: 'partners',
  partnerDetails: {
    name: 'partners.details',
    requires: 'id',
  },
  partnersForms: 'partners.forms',
  agreements: 'partners.agreements',
  agreementDetails: {
    name: 'partners.agreements.details',
    requires: 'id',
  },
  contracts: 'partners.contracts',
  contractDetails: {
    name: 'partners.contracts.details',
    requires: 'id',
  },
};

export const connectPortalRoutesDict = Object.freeze(Object.keys(routes).reduce((acc, curr) => {
  acc[curr] = Symbol(curr);

  return acc;
}, {}));

// Transform all route keys to Symbol and freeze resulting object
export const connectPortalRoutes = Object.freeze(Object.entries(routes).reduce((acc, [key, value]) => {
  acc[connectPortalRoutesDict[key]] = value;

  return acc;
}, {}));
