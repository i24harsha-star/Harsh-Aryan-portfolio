/**
 * Renders the gap where a detail Harsh has not supplied would go.
 *
 * The alternative — writing a plausible address or a plausible refund window —
 * would produce a policy that looks finished and binds him to terms he never
 * agreed to. This is deliberately conspicuous instead: dashed brass, in the
 * flow of the text, saying exactly what is missing and who has to supply it.
 */
export default function Pending({ what }: { what: string }) {
  return (
    <span className="legal-pending" role="note">
      <strong className="font-medium">To be added:</strong> {what}
    </span>
  );
}
