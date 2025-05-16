import * as React from "react";

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
    defaultValue?: string;
    value?: string;
    onValueChange?: (value: string) => void;
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
    ({ defaultValue, value, onValueChange, className = "", ...props }, ref) => {
        const [selectedTab, setSelectedTab] = React.useState(
            value || defaultValue
        );

        React.useEffect(() => {
            if (value !== undefined) {
                setSelectedTab(value);
            }
        }, [value]);

        const handleTabChange = (newValue: string) => {
            setSelectedTab(newValue);
            onValueChange?.(newValue);
        };

        const contextValue = React.useMemo(
            () => ({
                selectedValue: selectedTab,
                onChange: handleTabChange,
            }),
            [selectedTab]
        );

        return (
            <TabsContext.Provider value={contextValue}>
                <div
                    ref={ref}
                    className={`space-y-2 ${className}`}
                    {...props}
                />
            </TabsContext.Provider>
        );
    }
);
Tabs.displayName = "Tabs";

const TabsContext = React.createContext<
    | {
          selectedValue?: string;
          onChange: (value: string) => void;
      }
    | undefined
>(undefined);

function useTabsContext() {
    const context = React.useContext(TabsContext);
    if (!context) {
        throw new Error("Tabs components must be used within a Tabs provider");
    }
    return context;
}

const TabsList = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className = "", ...props }, ref) => (
    <div
        ref={ref}
        className={`inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground ${className}`}
        {...props}
    />
));
TabsList.displayName = "TabsList";

interface TabsTriggerProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    value: string;
}

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
    ({ value, className = "", ...props }, ref) => {
        const { selectedValue, onChange } = useTabsContext();
        const isSelected = selectedValue === value;

        return (
            <button
                ref={ref}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => onChange(value)}
                className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                    isSelected
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                } ${className}`}
                {...props}
            />
        );
    }
);
TabsTrigger.displayName = "TabsTrigger";

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
    value: string;
}

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
    ({ value, className = "", ...props }, ref) => {
        const { selectedValue } = useTabsContext();
        const isSelected = selectedValue === value;

        if (!isSelected) return null;

        return (
            <div ref={ref} role="tabpanel" className={className} {...props} />
        );
    }
);
TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent };
