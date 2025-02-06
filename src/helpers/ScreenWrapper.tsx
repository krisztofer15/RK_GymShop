import { ReactNode } from "react";

type Props = {
    children: ReactNode;
}

export default function ScreenWrapper({ children }: Props) {
    return (
        <div className="max-w-7xl mx-auto px-4">
            {children}
        </div>
    );
}