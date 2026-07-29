import {
  TabEntypo,
  TabFontAwesome6,
  TabIonicons,
  TabMaterialCommunityIcons,
} from "../components/UnistylesComponents";

export const routeNameToNavButtonTestId = (routeName: string) => {
  return `NAV_BUTTON_${routeName
    .replace(/\/index/g, "")
    .toUpperCase()
    .replace(/-/g, "_")}`;
};

export const getIconForRoute = (routeName: string, activated: boolean) => {
  if (routeName.includes("attendance")) {
    return (
      <TabFontAwesome6
        name={activated ? "calendar-plus" : "calendar"}
        size={25}
        uniProps={(theme) => ({
          color: activated ? theme.primary.main : theme.text.secondary,
        })}
      />
    );
  } else if (routeName.includes("classes")) {
    return (
      <TabEntypo
        name="blackboard"
        size={25}
        uniProps={(theme) => ({
          color: activated ? theme.primary.main : theme.text.secondary,
        })}
      />
    );
  } else if (routeName.includes("role-selection")) {
    return (
      <TabIonicons
        name="people"
        size={25}
        uniProps={(theme) => ({
          color: activated ? theme.primary.main : theme.text.secondary,
        })}
      />
    );
  } else if (routeName.includes("settings")) {
    return (
      <TabIonicons
        name={activated ? "settings" : "settings-outline"}
        size={25}
        uniProps={(theme) => ({
          color: activated ? theme.primary.main : theme.text.secondary,
        })}
      />
    );
  } else if (routeName.includes("create-class")) {
    return (
      <TabIonicons
        name="school"
        size={25}
        uniProps={(theme) => ({
          color: activated ? theme.primary.main : theme.text.secondary,
        })}
      />
    );
  } else if (routeName.includes("test")) {
    return (
      <TabMaterialCommunityIcons
        name={activated ? "test-tube" : "test-tube-empty"}
        size={25}
        uniProps={(theme) => ({
          color: activated ? theme.primary.main : theme.text.secondary,
        })}
      />
    );
  } else if (routeName.includes("analytics")) {
    return (
      <TabMaterialCommunityIcons
        name={activated ? "chart-timeline-variant" : "chart-timeline-variant"}
        size={27}
        uniProps={(theme) => ({
          color: activated ? theme.primary.main : theme.text.secondary,
        })}
      />
    );
  }
};
