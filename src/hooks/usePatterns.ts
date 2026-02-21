import { useState, useEffect, useCallback } from 'react';
import { Pattern } from '../types';
import * as patternService from '../services/patternService';

type QueryType = 'all' | 'user' | 'liked';

interface PatternData {
  patterns: Pattern[];
  totalCount: number;
}

interface UsePatternsResult {
  loading: boolean;
  error: string | null;
  data: PatternData | null;
  refetch: () => void;
}

export function usePatterns(
  queryType: QueryType,
  limit: number,
  offset: number,
  orderBy: string,
  userId?: string | null
): UsePatternsResult {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<PatternData | null>(null);
  const [refetchKey, setRefetchKey] = useState(0);

  const refetch = useCallback(() => {
    setRefetchKey((k) => k + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;
    if (!data) setLoading(true);
    setError(null);

    const fetchData = async () => {
      try {
        let result: PatternData;
        if (queryType === 'user' && userId) {
          result = await patternService.fetchUserPatterns(userId, limit, offset, orderBy);
        } else if (queryType === 'liked' && userId) {
          result = await patternService.fetchLikedPatterns(userId, limit, offset, orderBy);
        } else {
          result = await patternService.fetchPatterns(limit, offset, orderBy, userId);
        }
        if (!cancelled) {
          setData(result);
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err.message || 'Failed to load patterns');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();
    return () => { cancelled = true; };
  }, [queryType, limit, offset, orderBy, userId, refetchKey]);

  return { loading, error, data, refetch };
}
