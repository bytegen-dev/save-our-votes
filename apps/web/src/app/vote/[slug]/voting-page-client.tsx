'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import type { Election } from '@/lib/types/election';
import { api } from '@/lib/api/client';
import { showToast } from '@/lib/toast';
import { BallotDisplay } from './ballot-display';

interface VotingPageClientProps {
  election: Election;
}

export function VotingPageClient({ election }: VotingPageClientProps) {
  const [token, setToken] = useState<string>('');
  const [isValidating, setIsValidating] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTokenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) {
      setError('Please enter your voter token');
      return;
    }

    setIsValidating(true);
    setError(null);

    try {
      const response = await api.votes.validate({
        token: token.trim(),
        electionId: election._id,
      });

      if (response.status === 'success') {
        setIsAuthenticated(true);
        showToast.success('Token validated successfully');
      } else {
        setError('Invalid token. Please check and try again.');
      }
    } catch (error: any) {
      const reason = error?.data?.reason || 'unknown';
      let errorMessage = 'Invalid token. Please check and try again.';
      
      if (reason === 'used') {
        errorMessage = 'This token has already been used to cast a vote.';
      } else if (reason === 'expired') {
        errorMessage = 'This token has expired.';
      } else if (reason === 'invalid') {
        errorMessage = 'Invalid token. Please check and try again.';
      }

      setError(errorMessage);
      showToast.error(errorMessage);
    } finally {
      setIsValidating(false);
    }
  };

  if (isAuthenticated) {
    return <BallotDisplay election={election} token={token.trim()} />;
  }

  const primaryColor = election.branding?.primaryColor || '#000000';
  const secondaryColor = election.branding?.secondaryColor || '#666666';
  const logo = election.branding?.logo;

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 sm:p-6"
      style={{
        backgroundColor: primaryColor,
        color: secondaryColor,
      }}
    >
      <Card 
        className="w-full max-w-md shadow-2xl"
        style={{
          backgroundColor: secondaryColor,
          color: primaryColor,
          borderColor: primaryColor,
          borderWidth: '2px',
        }}
      >
        <CardHeader className="text-center pb-6">
          {logo && (
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-6">
              <Image
                src={logo}
                alt="Election logo"
                fill
                className="object-contain"
              />
            </div>
          )}
          <CardTitle 
            className="text-2xl sm:text-3xl font-semibold mb-3"
            style={{ color: primaryColor }}
          >
            {election.title}
          </CardTitle>
          {election.description && (
            <CardDescription 
              className="text-sm sm:text-base leading-relaxed"
              style={{ color: primaryColor, opacity: 0.85 }}
            >
              {election.description}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleTokenSubmit} className="space-y-5">
            <div className="space-y-3">
              <Label 
                htmlFor="token"
                className="text-sm font-medium"
                style={{ color: primaryColor }}
              >
                Voter Token
              </Label>
              <Input
                id="token"
                type="text"
                placeholder="Enter your voter token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                disabled={isValidating}
                autoFocus
                className="h-12 text-base"
                style={{
                  backgroundColor: 'white',
                  color: '#000000',
                  borderWidth: '2px',
                }}
              />
              <p 
                className="text-xs sm:text-sm"
                style={{ color: primaryColor, opacity: 0.75 }}
              >
                Enter the token provided to you to access this election.
              </p>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-shadow" 
              disabled={isValidating}
              style={{
                backgroundColor: primaryColor,
                color: secondaryColor,
              }}
            >
              {isValidating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Validating...
                </>
              ) : (
                'Continue to Vote'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
