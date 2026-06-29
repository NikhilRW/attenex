export interface TabBarButtonProps {
  name: string;
  isActivated: boolean;
  onPress: (routeName: string) => void;
  onPrefetch?: (routeName: string) => void;
  testID?: string;
}
