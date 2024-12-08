from rest_framework import serializers
from .models import Client, Template

class TemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Template
        fields = '__all__'

class ClientSerializer(serializers.ModelSerializer):
    id_template = TemplateSerializer()

    class Meta:
        model = Client
        fields = '__all__'

    def update(self, instance, validated_data):
        template_data = validated_data.pop('id_template', None)
        if template_data:
            template_instance = instance.id_template
            for attr, value in template_data.items():
                setattr(template_instance, attr, value)
            template_instance.save()

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
    

class TemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Template
        fields = ['id_template', 'nom']