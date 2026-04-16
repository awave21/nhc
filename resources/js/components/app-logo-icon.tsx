import type { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5 4L5 20L9 20L9 10L15 20L19 20L19 4L15 4L15 14L9 4L5 4Z"
            />
        </svg>
    );
}
