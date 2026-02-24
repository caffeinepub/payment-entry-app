import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Payment } from '../backend';

interface SubmitPaymentParams {
  invoiceNumber: bigint;
  paymentMode: string;
  transactionId: string | null;
  neftAmount: bigint | null;
  neftDate: string | null;
  bankName: string | null;
  chequeNumber: string | null;
  chequeAmount: bigint | null;
  chequeDate: string | null;
}

export function useGetAllPayments() {
  const { actor, isFetching } = useActor();

  return useQuery<Payment[]>({
    queryKey: ['payments'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPayments();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitPayment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: SubmitPaymentParams) => {
      if (!actor) throw new Error('Actor not initialized');
      
      return actor.submitPayment(
        params.invoiceNumber,
        params.paymentMode,
        params.transactionId,
        params.neftAmount,
        params.neftDate,
        params.bankName,
        params.chequeNumber,
        params.chequeAmount,
        params.chequeDate
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
    },
  });
}
