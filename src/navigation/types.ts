
export type RootStackParamList = {
  Loader: undefined;
  Onboarding: undefined;
  MainTabs: undefined;

  LocationDetailsScreen: { id: string };
  PacklistInside: { listId: string };
  PacklistInsideTemplate: { templateId: string };
  WildlifeDetails: { item: any }; 
};

export type MainTabsParamList = {
  Locations: undefined;
  Packlists: undefined;
  Wildlife: undefined;
  Quiz: undefined;
  Settings: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
