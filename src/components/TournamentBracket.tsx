import { useEffect, useState } from 'react';

interface TournamentBracketProps {
  challongeUrl?: string;
}

export const TournamentBracket = ({ challongeUrl }: TournamentBracketProps) => {
  const [bracketUrl, setBracketUrl] = useState<string>('');
  const [key, setKey] = useState<number>(0);

  useEffect(() => {
    if (challongeUrl) {
      const url = challongeUrl.includes('/module') 
        ? challongeUrl 
        : `${challongeUrl}/module`;
      setBracketUrl(url);
    }
  }, [challongeUrl]);

  useEffect(() => {
    const interval = setInterval(() => {
      setKey(prev => prev + 1);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  if (!bracketUrl) {
    return (
      <div className="flex items-center justify-center h-[500px] bg-gradient-to-br from-[#1A1F2C] to-[#221F26] rounded-lg border border-white/10">
        <p className="text-white/60">Турнирная сетка будет доступна после начала турнира</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[500px]">
      <iframe 
        key={key}
        src={bracketUrl}
        width="100%" 
        height="500" 
        className="rounded-lg border border-white/10"
        style={{ border: 0 }}
        title="Tournament Bracket"
      />
    </div>
  );
};

export default TournamentBracket;