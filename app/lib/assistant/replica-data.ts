import data from './replica-data.generated.json'

export type ReplicaNote = (typeof data.notes)[number]

export const replicaNotes: ReplicaNote[] = data.notes
