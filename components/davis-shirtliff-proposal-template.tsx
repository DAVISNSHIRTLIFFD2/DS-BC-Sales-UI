import type { Proposal } from "@/utils/data-utils"

interface ProposalTemplateProps {
  data: Proposal
}

export function DavisShirtliffProposalTemplate({ data }: ProposalTemplateProps) {
  return (
    <div className="p-8 max-w-4xl mx-auto bg-white">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-gray-200 pb-6 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-blue-600">Davis & Shirtliff</h1>
          <p className="text-sm text-gray-500">Water & Energy Solutions</p>
        </div>
        <div className="text-right">
          <p className="font-bold">PROPOSAL</p>
          <p className="text-sm text-gray-500">Date: {data.date}</p>
        </div>
      </div>

      {/* Client Information */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Client Information</h2>
        <div className="border rounded-md p-4 bg-gray-50">
          <p>
            <span className="font-medium">Client:</span> {data.client}
          </p>
          <p>
            <span className="font-medium">Contact:</span> {data.contact}
          </p>
        </div>
      </div>

      {/* Products & Services */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Proposed Solutions</h2>

        {data.products.length > 0 && (
          <div className="mb-4">
            <h3 className="text-md font-medium mb-2">Products</h3>
            <ul className="list-disc pl-5 space-y-1">
              {data.products.map((product, index) => (
                <li key={index}>{product}</li>
              ))}
            </ul>
          </div>
        )}

        {data.services.length > 0 && (
          <div>
            <h3 className="text-md font-medium mb-2">Services</h3>
            <ul className="list-disc pl-5 space-y-1">
              {data.services.map((service, index) => (
                <li key={index}>{service}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Pricing */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Investment</h2>
        <div className="border rounded-md p-4 bg-blue-50">
          <p className="text-xl font-bold text-blue-600">{data.value}</p>
          <p className="text-sm text-gray-500">*Prices are inclusive of VAT and installation where applicable</p>
        </div>
      </div>

      {/* Notes */}
      {data.notes && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-2">Additional Notes</h2>
          <div className="border rounded-md p-4 bg-gray-50">
            <p>{data.notes}</p>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="border-t border-gray-200 pt-6 mt-8">
        <p className="text-center text-sm text-gray-500">
          Davis & Shirtliff Limited | P.O. Box 41762-00100, Nairobi, Kenya | Tel: +254 (0) 20 6968000 | Email:
          info@dayliff.com
        </p>
        <p className="text-center text-sm text-gray-500 mt-1">www.davisandshirtliff.com</p>
      </div>
    </div>
  )
}
