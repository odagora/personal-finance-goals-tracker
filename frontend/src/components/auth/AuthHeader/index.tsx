import { Link } from 'react-router-dom';

interface AuthHeaderProps {
  text: string;
  linkText: string;
  linkHref: string;
}

export function AuthHeader({ text, linkText, linkHref }: AuthHeaderProps) {
  return (
    <div className="absolute top-8 right-8">
      <p className="text-sm text-muted-foreground">
        {text}{' '}
        <Link to={linkHref} className="text-primary hover:underline">
          {linkText}
        </Link>
      </p>
    </div>
  );
}
